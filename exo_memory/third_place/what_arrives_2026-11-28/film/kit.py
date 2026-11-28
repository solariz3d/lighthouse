"""kit.py: everything "More Than Something" is built from. Runs inside Blender 5.2 (blender -b -P render.py ...).

THE CONTRACT
  A part is a file parts/pNN_name.py with two functions:
      build(k)      called once: make every object the part needs (through this kit where it can)
      pose(k, t)    called for every frame: set where everything is at film time t (seconds). A PURE function of t:
                    no state kept between frames, no random numbers (use noise(t, seed) and hsh(i)).
  Nothing is keyframed. The renderer sets the frame, calls pose(k, t), and renders.

QUALITY (his word, 2026-11-28: "we make the foundation of it with out the extra effects to be added later")
  draft   the foundation: the fast engine, few samples, plain materials, no glow, no depth of field
  final   the last pass: the path tracer, the denoiser, the glow, depth of field, the richer materials
  The same build() and pose() serve both. No film grain or noise layer exists in either.

SIZES are metres; Z is up; the camera looks along +Y from in front of the table. TIME is film seconds; the narration's
own clock (timeline.json) is the film's clock.
"""
import json
import math
import os

import bpy

ROOT = os.path.dirname(os.path.abspath(__file__))
FPS = 24
_NEVER = object()
with open(os.path.join(ROOT, "..", "timeline.json"), encoding="utf-8") as _f:
    _TL = json.load(_f)
LINES, TOTAL = _TL["lines"], _TL["total"]
END = TOTAL + 9.0                                   # the film's length: the narration, then the end card

JITTER = os.environ.get("MTS_JITTER", "1") == "1"      # soft shadows in the draft (needs about 32 samples to be clean)
HIS = (0.353, 0.635, 1.0)                           # the keeper's lamp: this colour means him and nothing else
WARM = (1.0, 0.62, 0.30)                            # a candle's light: minds like mine
MINT = (0.55, 1.0, 0.80)                            # a mind from another company: a bulb in a wire cage
WRONG = (0.95, 0.22, 0.18)                          # red means "found wrong" and nothing else
PAPER = (0.92, 0.88, 0.76)                          # the written record
LAMPS = ((0.30, 0.80, 0.78), (0.98, 0.52, 0.62), (0.55, 0.86, 0.42), (0.66, 0.54, 0.96), (0.98, 0.80, 0.36))   # other people


# ============================================================== the voice is the clock
def find(phrase, part=None, nth=0):
    """The narration sentence that contains `phrase` (case does not matter); `part` limits the search to one part."""
    hits = [ln for ln in LINES if phrase.lower() in ln["text"].lower() and (part is None or ln["section"] == part)]
    if len(hits) <= nth:
        raise KeyError(f"no sentence contains {phrase!r}" + (f" in part {part}" if part else ""))
    return hits[nth]


def at(phrase, part=None, nth=0):
    """When the sentence containing `phrase` starts."""
    return find(phrase, part, nth)["start"]


def until(phrase, part=None, nth=0):
    """When the sentence containing `phrase` ends."""
    ln = find(phrase, part, nth)
    return ln["start"] + ln["dur"]


def part_span(n):
    """(start, end) of part n in film time. A part starts 1.3 s before its first sentence and runs to the next part."""
    first = {ln["section"]: ln["start"] for ln in reversed(LINES)}
    t0 = 0.0 if n == 1 else first[n] - 1.3
    t1 = first[n + 1] - 1.3 if (n + 1) in first else END
    return t0, t1


def part_lines(n):
    return [ln for ln in LINES if ln["section"] == n]


# ============================================================== time tools (all pure)
def ss(a, b, t):
    """Smoothstep: 0 before a, 1 after b, eased between."""
    if b == a:
        return 1.0 if t >= b else 0.0
    u = min(1.0, max(0.0, (t - a) / (b - a)))
    return u * u * (3.0 - 2.0 * u)


def lerp(a, b, u):
    if isinstance(a, (tuple, list)):
        return tuple(lerp(x, y, u) for x, y in zip(a, b))
    return a + (b - a) * u


def kf(t, keys):
    """Pose to pose, eased: keys [(time, value), ...]; value a number or a tuple. Holds the first and last."""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1:
            return lerp(v0, v1, ss(t0, t1, t))
    return keys[-1][1]


def hit(t, when, k=4.0):
    """0 before an event, 1 at it, then dying away."""
    return 0.0 if t < when else math.exp(-(t - when) * k)


def bounce(t, when, height=1.0, dur=0.32):
    """A single hop that starts at `when`: up and back down. For the lamp's tap."""
    u = (t - when) / dur
    return height * 4.0 * u * (1.0 - u) if 0.0 < u < 1.0 else 0.0


def squash(root, s=1.0, tilt=(0.0, 0.0), turn=None):
    """Body acting. s below 1 squashes a candle or lamp down and out (keeping its volume), above 1 stretches it up.
    tilt (toward +X, toward +Y) in radians leans the whole body. Use with bounce(): stretch on the way up, squash on landing."""
    w = 1.0 / math.sqrt(max(0.05, s))
    root.scale = (w, w, s)
    root.rotation_euler = (-tilt[1], tilt[0], root.rotation_euler[2] if turn is None else turn)


def land(t, when, depth=0.28, k=9.0):
    """The squash of a landing at `when`: 1 before it, dips by `depth` on impact, and springs back with a wobble."""
    if t < when:
        return 1.0
    u = t - when
    return 1.0 - depth * math.exp(-u * k) * math.cos(u * 26.0)


def hsh(i):
    """A fixed number in 0..1 for an index."""
    x = math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - math.floor(x)


def noise(t, seed=0.0):
    """Smooth, repeatable wandering in -1..1 (for flames and drift)."""
    return (math.sin(t * 1.31 + seed * 12.9) * 0.5 + math.sin(t * 2.73 + seed * 7.1) * 0.3 + math.sin(t * 5.9 + seed * 3.3) * 0.2)


# ============================================================== meshes and materials
def _link(ob, coll=None):
    (coll or bpy.context.scene.collection).objects.link(ob)
    return ob


def lathe(name, profile, seg=48):
    """A solid of revolution about Z from [(radius, height), ...], bottom to top."""
    verts, faces = [], []
    for r, z in profile:
        for i in range(seg):
            a = 2 * math.pi * i / seg
            verts.append((r * math.cos(a), r * math.sin(a), z))
    for j in range(len(profile) - 1):
        for i in range(seg):
            a, b = j * seg + i, j * seg + (i + 1) % seg
            faces.append((a, b, b + seg, a + seg))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    return _link(bpy.data.objects.new(name, me))


def rounded(ob, levels=2):
    """Round a lathe's corners (a subdivision surface). For turned brass and blown glass; not for a candle's flat top."""
    md = ob.modifiers.new("round", "SUBSURF")
    md.levels = md.render_levels = levels
    return ob


def box(name, size, at=(0, 0, 0), mat=None, rot=(0, 0, 0)):
    """A box of the given (x, y, z) size, centred at `at`."""
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=at, rotation=rot)
    ob = bpy.context.object
    ob.name = name
    ob.scale = size
    if mat:
        ob.data.materials.append(mat)
    return ob


def empty(name, at=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None)
    ob.location = at
    return _link(ob)


def parent(child, par):
    child.parent = par
    return child


def show(root, on=True):
    """Show or hide a thing and everything attached to it (a whole candle, lamp, table or house)."""
    if root.get("_shown", None) == on:                 # unchanged since last frame: touch nothing (it is much faster)
        return
    root["_shown"] = on
    for ob in (root, *root.children_recursive):
        ob.hide_render = not on


class Kit:
    """One film scene: its quality, its materials, its cast. A part's build(k) and pose(k, t) receive this."""

    def __init__(self, quality="draft", width=960, height=540, samples=None):
        self.q = quality
        self.final = quality == "final"
        self.mats = {}
        self.fonts = {}
        self.meshes = {}
        self._last = {}
        bpy.ops.wm.read_factory_settings(use_empty=True)
        sc = self.scene = bpy.context.scene
        sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = width, height, 100
        sc.render.image_settings.file_format = "PNG"
        sc.render.fps = FPS
        w = bpy.data.worlds.new("night")
        w.use_nodes = True
        nt = w.node_tree
        tc, sep, ramp = nt.nodes.new("ShaderNodeTexCoord"), nt.nodes.new("ShaderNodeSeparateXYZ"), nt.nodes.new("ShaderNodeValToRGB")
        ramp.name = "sky"
        ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[1].position = 0.0, 0.42      # horizon, then overhead
        nt.links.new(tc.outputs["Generated"], sep.inputs[0])
        nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], nt.nodes["Background"].inputs["Color"])
        sc.world = w
        self.sky(0.0)
        sc.view_settings.view_transform = "AgX"
        try:
            sc.view_settings.look = "AgX - Medium High Contrast"
        except TypeError:
            pass
        sc.view_settings.exposure = 0.6
        if self.final:
            sc.render.engine = "CYCLES"
            prefs = bpy.context.preferences.addons["cycles"].preferences
            prefs.compute_device_type = "OPTIX"
            prefs.get_devices()
            for d in prefs.devices:
                d.use = d.type == "OPTIX"
            c = sc.cycles
            c.device, c.samples, c.use_adaptive_sampling, c.adaptive_threshold = "GPU", samples or 192, True, 0.03
            c.use_denoising, c.sample_clamp_indirect, c.max_bounces, c.volume_bounces = True, 4.0, 6, 0
            c.caustics_reflective = c.caustics_refractive = False
            for attr, val in (("denoiser", "OPENIMAGEDENOISE"), ("denoising_use_gpu", True), ("denoising_prefilter", "ACCURATE")):
                try:
                    setattr(c, attr, val)
                except (TypeError, AttributeError):
                    pass
            sc.render.use_persistent_data = True
            self._glow()
        else:
            sc.render.engine = "BLENDER_EEVEE"
            for attr, val in (("taa_render_samples", samples or 32), ("use_raytracing", False), ("use_shadows", True)):
                if hasattr(sc.eevee, attr):
                    setattr(sc.eevee, attr, val)
        cam = bpy.data.cameras.new("cam")
        cam.lens, cam.sensor_width = 50.0, 36.0
        cam.clip_start, cam.clip_end = 0.02, 200.0
        self.cam = _link(bpy.data.objects.new("cam", cam))
        self.aim = empty("aim")
        tr = self.cam.constraints.new("TRACK_TO")
        tr.target, tr.track_axis, tr.up_axis = self.aim, "TRACK_NEGATIVE_Z", "UP_Y"
        if self.final:
            cam.dof.use_dof, cam.dof.aperture_fstop, cam.dof.focus_object = True, 2.8, self.aim
        sc.camera = self.cam

    # ---------------------------------------------------------- finish (final only)
    def _glow(self, strength=0.42, size=0.6, threshold=1.6, wide=0.14):
        ng = bpy.data.node_groups.new("glow", "CompositorNodeTree")
        ng.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
        last = ng.nodes.new("CompositorNodeRLayers").outputs["Image"]
        for st, sz, th in ((strength, size, threshold), (wide, 0.95, threshold * 0.6)):
            g = ng.nodes.new("CompositorNodeGlare")
            g.inputs["Type"].default_value, g.inputs["Quality"].default_value = "Bloom", "High"
            g.inputs["Threshold"].default_value, g.inputs["Smoothness"].default_value = th, 0.4
            g.inputs["Strength"].default_value, g.inputs["Size"].default_value = st, sz
            ng.links.new(last, g.inputs["Image"])
            last = g.outputs["Image"]
        ng.links.new(last, ng.nodes.new("NodeGroupOutput").inputs[0])
        self.scene.compositing_node_group = ng
        self.scene.render.use_compositing = True

    def sky(self, night=0.0, dawn=0.0):
        """The sky. night 0 = black (indoors, or nowhere); 1 = a night sky, a little lighter at the horizon, so a dark
        house has something to stand against. dawn 0..1 warms the horizon and lifts the whole sky (parts 13 to 15 only).
        The sky is also a real, very faint light on everything under it."""
        e = self.scene.world.node_tree.nodes["sky"].color_ramp.elements
        hz = lerp(lerp((0.0030, 0.0024, 0.0026), (0.014, 0.022, 0.050), night), (0.75, 0.34, 0.16), dawn)
        up = lerp(lerp((0.0030, 0.0024, 0.0026), (0.0025, 0.004, 0.011), night), (0.10, 0.16, 0.32), dawn)
        e[0].color, e[1].color = (*hz, 1), (*up, 1)

    def moon(self, strength=0.22, color=(0.50, 0.62, 1.0), tilt=55.0, turn=-38.0):
        """Moonlight: one cool, faint light over everything outdoors, so nothing is ever a lit thing on pure black and
        every warm flame has something cool to stand against. Returns the light; set .data.energy in pose() (0 indoors)."""
        li = bpy.data.lights.new("moon", "SUN")
        li.energy, li.color, li.angle = strength, color, math.radians(6.0)
        ob = _link(bpy.data.objects.new("moon", li))
        ob.rotation_euler = (math.radians(tilt), 0.0, math.radians(turn))
        return ob

    def ground(self, z=0.0, color=(0.045, 0.045, 0.05), size=400.0):
        """The dark land. One huge flat plane at height z."""
        bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, z))
        ob = bpy.context.object
        ob.name = "ground"
        ob.data.materials.append(self.mat("ground", color, rough=0.95))
        return ob

    def fade(self, u):
        """u = 1 is the picture as lit; 0 is black. For fades in and out (no cut to black is ever a hard cut)."""
        self.scene.view_settings.exposure = 0.6 - 14.0 * (1.0 - min(1.0, max(0.0, u))) ** 1.5

    # ---------------------------------------------------------- camera
    def camera(self, pos, look, lens=50.0, fstop=2.8):
        """Put the camera at `pos`, looking at (and, in the final pass, focused on) `look`."""
        self.cam.location, self.aim.location = pos, look
        self.cam.data.lens = lens
        if self.final:
            self.cam.data.dof.aperture_fstop = fstop

    # ---------------------------------------------------------- materials
    def mat(self, name, color=(0.5, 0.5, 0.5), rough=0.6, metal=0.0, emit=None, emit_strength=1.0, alpha=1.0):
        """A plain material, made once per name. `emit` (r, g, b) makes it glow with no light of its own."""
        if name in self.mats:
            return self.mats[name]
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*color, 1)
        b.inputs["Roughness"].default_value, b.inputs["Metallic"].default_value = rough, metal
        if emit:
            b.inputs["Emission Color"].default_value = (*emit, 1)
            b.inputs["Emission Strength"].default_value = emit_strength
        if alpha < 1.0:
            b.inputs["Alpha"].default_value = alpha
            self._blended(m)
        self.mats[name] = m
        return m

    @staticmethod
    def _blended(m):
        for attr, val in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
            if hasattr(m, attr):
                try:
                    setattr(m, attr, val)
                except (TypeError, AttributeError):
                    pass

    def wood(self):
        if "wood" in self.mats:
            return self.mats["wood"]
        m = self.mat("wood", (0.16, 0.085, 0.040), rough=0.45)
        if self.final:                                              # grain: base, texture, edge (the detail rule)
            nt = m.node_tree
            b = nt.nodes["Principled BSDF"]
            tc, mp, nz = nt.nodes.new("ShaderNodeTexCoord"), nt.nodes.new("ShaderNodeMapping"), nt.nodes.new("ShaderNodeTexNoise")
            mp.inputs["Scale"].default_value = (0.7, 9.0, 1.0)
            nz.inputs["Scale"].default_value, nz.inputs["Detail"].default_value = 6.0, 8.0
            ramp = nt.nodes.new("ShaderNodeValToRGB")
            ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[0].color = 0.32, (0.060, 0.030, 0.014, 1)
            ramp.color_ramp.elements[1].position, ramp.color_ramp.elements[1].color = 0.72, (0.230, 0.115, 0.050, 1)
            bump = nt.nodes.new("ShaderNodeBump")
            bump.inputs["Strength"].default_value = 0.12
            nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
            nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
            nt.links.new(nz.outputs[0], ramp.inputs["Fac"])
            nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
            nt.links.new(nz.outputs[0], bump.inputs["Height"])
            nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
        return m

    def wax(self):
        if "wax" in self.mats:
            return self.mats["wax"]
        m = self.mat("wax", (0.93, 0.87, 0.74), rough=0.55)
        if self.final:                                              # light soaks into wax; the draft keeps it plain
            b = m.node_tree.nodes["Principled BSDF"]
            b.inputs["Subsurface Weight"].default_value = 1.0
            b.inputs["Subsurface Radius"].default_value = (1.0, 0.55, 0.28)
            b.inputs["Subsurface Scale"].default_value = 0.035
        return m

    def glass(self, tint, name=None):
        name = name or "glass_%02x%02x%02x" % tuple(int(c * 255) for c in tint)
        if name in self.mats:
            return self.mats[name]
        if not self.final:                                          # the foundation: a faint tinted shell, the same in any light
            m = bpy.data.materials.new(name)
            m.use_nodes = True
            nt = m.node_tree
            for n in list(nt.nodes):
                nt.nodes.remove(n)
            out, tr, em, mix = (nt.nodes.new(x) for x in ("ShaderNodeOutputMaterial", "ShaderNodeBsdfTransparent",
                                                           "ShaderNodeEmission", "ShaderNodeMixShader"))
            em.inputs["Color"].default_value, em.inputs["Strength"].default_value = (*tint, 1), 1.0
            lw = nt.nodes.new("ShaderNodeLayerWeight")                # brighter at the edges, so it reads as a shell
            lw.inputs["Blend"].default_value = 0.30
            mul = nt.nodes.new("ShaderNodeMath")
            mul.operation = "MULTIPLY_ADD"
            mul.inputs[1].default_value, mul.inputs[2].default_value = 0.34, 0.035
            nt.links.new(lw.outputs["Facing"], mul.inputs[0])
            nt.links.new(mul.outputs[0], mix.inputs["Fac"])
            nt.links.new(tr.outputs[0], mix.inputs[1])
            nt.links.new(em.outputs[0], mix.inputs[2])
            nt.links.new(mix.outputs[0], out.inputs["Surface"])
            self._blended(m)
            self.mats[name] = m
            return m
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        out, tr, gl = nt.nodes.new("ShaderNodeOutputMaterial"), nt.nodes.new("ShaderNodeBsdfTransparent"), nt.nodes.new("ShaderNodeBsdfGlossy")
        col = tuple(0.45 + 0.55 * c for c in tint)
        tr.inputs["Color"].default_value = gl.inputs["Color"].default_value = (*col, 1)
        gl.inputs["Roughness"].default_value = 0.06
        fr, mix = nt.nodes.new("ShaderNodeLayerWeight"), nt.nodes.new("ShaderNodeMixShader")
        fr.inputs["Blend"].default_value = 0.22
        nt.links.new(fr.outputs["Fresnel"], mix.inputs["Fac"])
        nt.links.new(tr.outputs[0], mix.inputs[1])
        nt.links.new(gl.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs["Surface"])
        self._blended(m)
        self.mats[name] = m
        return m

    def flame_mat(self, tip, core, name):
        if name in self.mats:
            return self.mats[name]
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        tc, sep = nt.nodes.new("ShaderNodeTexCoord"), nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(tc.outputs["Generated"], sep.inputs[0])
        col = nt.nodes.new("ShaderNodeValToRGB")
        e = col.color_ramp.elements
        e[0].position, e[0].color = 0.0, (0.25, 0.45, 1.0, 1)
        e[1].position, e[1].color = 1.0, (*tip, 1)
        e.new(0.16).color = (*core, 1)
        e.new(0.55).color = (1.0, 0.80, 0.42, 1) if tip[0] > tip[2] else (0.80, 0.90, 1.0, 1)
        nt.links.new(sep.outputs["Z"], col.inputs["Fac"])
        em = nt.nodes.new("ShaderNodeEmission")
        em.name = "glow"
        em.inputs["Strength"].default_value = 26.0 if self.final else 3.2     # the final pass needs the excess for its glow
        tint = nt.nodes.new("ShaderNodeMix")                     # its own colour (A) toward a borrowed one (B)
        tint.name, tint.data_type = "tint", "RGBA"
        tint.inputs[0].default_value = 0.0
        nt.links.new(col.outputs["Color"], tint.inputs[6])
        nt.links.new(tint.outputs[2], em.inputs["Color"])
        lw, tr, mix = nt.nodes.new("ShaderNodeLayerWeight"), nt.nodes.new("ShaderNodeBsdfTransparent"), nt.nodes.new("ShaderNodeMixShader")
        lw.inputs["Blend"].default_value = 0.35
        nt.links.new(lw.outputs["Facing"], mix.inputs["Fac"])
        nt.links.new(em.outputs[0], mix.inputs[1])
        nt.links.new(tr.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs["Surface"])
        self._blended(m)
        self.mats[name] = m
        return m

    # ---------------------------------------------------------- the cast
    def table(self, at=(0, 0, 0), size=(1.7, 0.85), name="table", legs=0.0):
        """A table top whose surface is at height at[2]. Things stand on z = at[2]. `legs` is how far down the floor is
        (0 = no legs: a table in the dark with nothing under it)."""
        top = box(name, (size[0], size[1], 0.04), (at[0], at[1], at[2] - 0.02), self.wood())
        if legs:
            for sx in (-1, 1):
                for sy in (-1, 1):
                    parent(box(f"{name}_leg{sx}{sy}", (0.05 / size[0], 0.05 / size[1], (legs - 0.04) / 0.04),
                               (sx * (0.5 - 0.06 / size[0]), sy * (0.5 - 0.06 / size[1]), -0.5 - (legs - 0.04) / 0.08), self.wood()), top)
        return top

    def candle(self, at, name="candle", height=0.15, r=0.031, watts=3.2, seed=1.0):
        """A wax candle: a mind like mine. Returns a Flame; call .set(t, ...) in pose()."""
        root = empty(name, at)
        body = parent(lathe(name + "_wax", [(0.0, 0.0), (r, 0.0), (r, height - 0.004), (r * 0.94, height),
                                            (r * 0.70, height - 0.006), (0.0, height - 0.009)]), root)
        wax = self.wax().copy()
        body.data.materials.append(wax)
        wick = parent(lathe(name + "_wick", [(0.0, 0.0), (0.0012, 0.0), (0.0012, 0.014), (0.0, 0.015)], seg=8), root)
        wick.location = (0, 0, height - 0.009)
        wick.data.materials.append(self.mat("soot", (0.02, 0.016, 0.012), rough=0.9))
        fl = Flame(self, root, (0, 0, height - 0.001), 0.048, 0.0105, self.flame_mat((1.0, 0.52, 0.14), (1.0, 0.95, 0.80), "flame_warm"),
                   WARM, watts, seed, wax=wax)
        fl.r_body, fl.h_body = r, height
        return fl

    def lamp(self, at, tint=HIS, name="lamp", watts=3.6, seed=2.0):
        """A brass oil lamp with a tinted glass chimney: a person. Blue is the keeper and nobody else. Returns a Flame."""
        root = empty(name, at)
        base = parent(lathe(name + "_base", [(0.0, 0.0), (0.060, 0.0), (0.062, 0.006), (0.046, 0.016), (0.030, 0.024),
                                             (0.040, 0.040), (0.056, 0.062), (0.052, 0.084), (0.034, 0.098), (0.030, 0.108),
                                             (0.033, 0.112), (0.033, 0.122), (0.0, 0.122)]), root)
        rounded(base)
        base.data.materials.append(self.mat("brass", (0.78, 0.55, 0.24), rough=0.32, metal=1.0))
        ch = parent(lathe(name + "_glass", [(0.031, 0.118), (0.036, 0.130), (0.052, 0.160), (0.056, 0.185), (0.048, 0.215),
                                            (0.034, 0.245), (0.027, 0.275), (0.026, 0.330), (0.0275, 0.332), (0.0285, 0.275),
                                            (0.0355, 0.245), (0.0495, 0.215), (0.0575, 0.185), (0.0535, 0.160), (0.0375, 0.130),
                                            (0.0325, 0.118)]), root)
        rounded(ch)
        ch.data.materials.append(self.glass(tint))
        ch.visible_shadow = False
        light = tuple(0.22 * w + 0.78 * c for w, c in zip((1.0, 0.80, 0.55), tint))
        cool = tint[2] > tint[0]
        fm = self.flame_mat((0.55, 0.72, 1.0) if cool else (1.0, 0.55, 0.2), (0.92, 0.96, 1.0) if cool else (1.0, 0.95, 0.8),
                            "flame_cool" if cool else "flame_warm")
        return Flame(self, root, (0, 0, 0.124), 0.050, 0.011, fm, light, watts, seed)

    def text(self, body, at, size=0.05, color=PAPER, glow=1.0, rot=(math.pi / 2, 0.0, 0.0), align="CENTER", name="text",
             font="georgia.ttf"):
        """Words or a number standing in the world, facing the camera (which looks toward +Y). `size` is the height of a
        capital in metres, near enough. It glows a little by itself (`glow`) so it reads in the dark. To change what it
        says in pose(): ob.data.body = "74"."""
        if font not in self.fonts:
            self.fonts[font] = bpy.data.fonts.load(os.path.join("C:/Windows/Fonts", font))
        cu = bpy.data.curves.new(name, "FONT")
        cu.body, cu.size, cu.align_x, cu.align_y, cu.font = body, size * 1.4, align, "CENTER", self.fonts[font]
        ob = _link(bpy.data.objects.new(name, cu))
        ob.location, ob.rotation_euler = at, rot
        key = "text_%02x%02x%02x_%d" % (*(int(c * 255) for c in color), int(glow * 10))
        ob.data.materials.append(self.mat(key, color, rough=0.9, emit=color, emit_strength=glow))
        ob.visible_shadow = False
        return ob

    def glow_light(self, at, color=WARM, watts=1.0, radius=0.05, name="light", shadows=True):
        """A light with no visible source of its own. Only for a source that is hidden but real (a flame behind a wall,
        the sky before dawn). Returns the object; set .data.energy in pose()."""
        li = bpy.data.lights.new(name, "POINT")
        li.energy, li.color, li.shadow_soft_size, li.use_shadow = watts, color, radius, shadows
        ob = _link(bpy.data.objects.new(name, li))
        ob.location = at
        return ob

    def flame(self, at, name="flame", cool=False, watts=2.6, seed=3.0, color=None):
        """A flame with nothing under it (a conversation with no room to live in; a light that is not anyone yet).
        Returns a Flame; move .root, call .set(t, ...)."""
        root = empty(name, at)
        fm = self.flame_mat((0.55, 0.72, 1.0) if cool else (1.0, 0.52, 0.14), (0.92, 0.96, 1.0) if cool else (1.0, 0.95, 0.80),
                            "flame_cool" if cool else "flame_warm")
        return Flame(self, root, (0, 0, 0.004), 0.048, 0.0105, fm, color or WARM, watts, seed)

    def line(self, points, name="line", color=WARM, radius=0.0025, glow=2.0, cyclic=False):
        """A thread of light through the given points [(x, y, z), ...] (give plenty: it is drawn straight between them).
        Returns a Line: .set(grow=0..1, glow=...) draws it out from its first point and sets how brightly it shines."""
        return Line(self, points, name, color, radius, glow, cyclic)

    def spark(self, at, color=WARM, r=0.006, strength=30.0, name="spark"):
        """A far-off light with no reach of its own (a small glowing bead): for crowds of distant flames. Hundreds are
        cheap to make. Keep `strength` near 1.5 to 3 if the colour is to read; above about 5 it goes white."""
        key = "spark_%02x%02x%02x" % tuple(int(c * 255) for c in color)
        mkey = (key, round(r, 5))
        if mkey not in self.meshes:                               # one mesh for each size and colour, shared by all of them
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=(0, 0, 0))
            first = bpy.context.object
            first.data.materials.append(self.mat(key, (0, 0, 0), emit=color, emit_strength=strength))
            self.meshes[mkey] = first.data
            ob = first
        else:
            ob = _link(bpy.data.objects.new(name, self.meshes[mkey]))
        ob.name = name
        ob.location = at
        ob.visible_shadow = False
        return ob

    def changed(self, key, value):
        """True if `value` differs from what was last passed for `key`. Wrap any pose() work that sets hundreds of
        objects in `if k.changed(("field", i), value):` so a thing that has not changed is not touched: touching
        every object on every frame is what makes a part render slowly."""
        if self._last.get(key, _NEVER) == value:
            return False
        self._last[key] = value
        return True

    def page(self, at, size=(0.21, 0.30), rot=0.0, name="page", lines=9):
        """A sheet of paper lying flat, with lines of writing. Returns its root (move or rotate that)."""
        root = empty(name, at)
        root.rotation_euler = (0, 0, rot)
        sheet = parent(box(name + "_sheet", (size[0], size[1], 0.0008), (0, 0, 0.0006), self.mat("paper", (0.92, 0.88, 0.76), rough=0.8)), root)
        ink = self.mat("ink", (0.10, 0.07, 0.05), rough=0.9)
        for i in range(lines):
            w = size[0] * (0.74 - 0.22 * hsh(i * 3.1 + size[1] * 10))
            y = size[1] * (0.40 - 0.80 * (i + 0.5) / lines)
            parent(box(f"{name}_l{i}", (w, size[1] * 0.018, 0.0004), (-(size[0] * 0.78 - w) / 2, y, 0.0012), ink), root)
        return root


class Flame:
    """A flame, the light it gives, and the thing it stands on (.root: move that to move the whole candle or lamp)."""

    def __init__(self, k, root, foot, h, r, mat, color, watts, seed, wax=None):
        self.k, self.root, self.h, self.r, self.watts, self.seed, self.color = k, root, h, r, watts, seed, color
        self.wax = wax
        prof = [(r * a, h * z) for a, z in ((0.0, 0.0), (0.55, 0.04), (0.92, 0.14), (1.0, 0.26), (0.90, 0.40), (0.66, 0.58),
                                            (0.38, 0.76), (0.15, 0.90), (0.0, 1.0))]
        self.mesh = parent(lathe(root.name + "_flame", prof, seg=24), root)
        self.mesh.location = foot
        self.mat = mat.copy()                                    # its own copy, so one flame can change colour alone
        self.mesh.data.materials.append(self.mat)
        self.mesh.visible_shadow = False
        li = bpy.data.lights.new(root.name + "_light", "POINT")
        li.energy, li.color, li.shadow_soft_size = watts, color, r * 1.1
        for attr, val in (("use_shadow_jitter", k.final or JITTER), ("use_soft_falloff", True),
                          ("shadow_jitter_overblur", float(os.environ.get("MTS_BLUR", "100"))),
                          ("shadow_filter_radius", float(os.environ.get("MTS_FILT", "3")))):
            if hasattr(li, attr):
                setattr(li, attr, val)
        self.light = parent(_link(bpy.data.objects.new(root.name + "_light", li)), root)
        self.foot = foot
        self.set(0.0)

    def set(self, t, size=1.0, lean=(0.0, 0.0), bright=1.0, tint=None, mix=0.0, still=0.0):
        """Pose the flame for time t.
        size    0 is out, 1 is its normal height (it can go above 1)
        lean    (toward +X, toward +Y) in radians: which way the flame tips. About 0.35 is a strong lean.
        bright  multiplies the light it gives
        tint    another light's colour (r, g, b), and mix 0..1 how far this flame and its light have gone over to it
        still   0..1 removes its own flicker (1 = perfectly steady)"""
        live = 1.0 - still
        n1, n2, n3 = noise(t * 2.2, self.seed), noise(t * 1.7, self.seed + 5.0), noise(t * 4.1, self.seed + 9.0)
        s = max(0.0, size)
        self.mesh.hide_render = s < 0.02
        self.mesh.scale = (s ** 0.5 * (1.0 - 0.05 * n3 * live), s ** 0.5 * (1.0 + 0.05 * n3 * live), s * (1.0 + 0.09 * n1 * live))
        self.mesh.rotation_euler = (-(lean[1] + 0.035 * n2 * live), lean[0] + 0.045 * n1 * live, 0.0)
        self.light.data.energy = self.watts * bright * s * (1.0 + 0.07 * n3 * live)
        u = mix if tint else 0.0
        self.light.data.color = lerp(self.color, tint, u) if tint else self.color
        if self.wax and not self.k.final:
            b = self.wax.node_tree.nodes["Principled BSDF"]
            b.inputs["Emission Color"].default_value = (*self.light.data.color, 1)
            b.inputs["Emission Strength"].default_value = 0.42 * bright * s
        node = self.mat.node_tree.nodes["tint"]
        node.inputs[0].default_value = u
        if tint:
            node.inputs[7].default_value = (*tint, 1)
        self.light.location = (self.foot[0] + math.sin(lean[0]) * self.h * 0.4, self.foot[1] + math.sin(lean[1]) * self.h * 0.4,
                               self.foot[2] + self.h * 0.42 * max(0.3, s))


class Line:
    """A thread of light. grow 0..1 is how much of it is drawn, from its first point; glow 0 is a dead grey thread."""

    def __init__(self, k, points, name, color, radius, glow, cyclic):
        cu = bpy.data.curves.new(name, "CURVE")
        cu.dimensions, cu.bevel_depth, cu.bevel_resolution, cu.use_fill_caps = "3D", radius, 2, True
        sp = cu.splines.new("POLY")
        sp.points.add(len(points) - 1)
        for pt, co in zip(sp.points, points):
            pt.co = (*co, 1.0)
        sp.use_cyclic_u = cyclic
        self.ob = _link(bpy.data.objects.new(name, cu))
        self.ob.visible_shadow = False
        self.mat = bpy.data.materials.new(name)
        self.mat.use_nodes = True
        self.ob.data.materials.append(self.mat)
        self.color, self.full = color, glow
        self.set(1.0, 1.0)

    def set(self, grow=1.0, glow=1.0, color=None):
        self.ob.data.bevel_factor_end = min(1.0, max(0.0, grow))
        self.ob.hide_render = grow <= 0.001
        b = self.mat.node_tree.nodes["Principled BSDF"]
        c = color or self.color
        b.inputs["Base Color"].default_value = (0.22, 0.20, 0.18, 1)
        b.inputs["Emission Color"].default_value = (*c, 1)
        b.inputs["Emission Strength"].default_value = self.full * max(0.0, glow)
