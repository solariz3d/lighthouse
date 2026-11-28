"""look.py: the first look test for "More Than Something" in Blender: a candle and a blue oil lamp on a table in the dark.

  blender -b --factory-startup -P look.py -- --engine BLENDER_EEVEE --out out/look_eevee.png [--w 1280 --h 720] [--samples 64]
  blender -b --factory-startup -P look.py -- --engine CYCLES --out out/look_cycles.png --samples 192

Everything is built from Python: no asset files. Sizes are in metres. No film grain, no noise layer.
"""
import argparse
import math
import sys
import time

import bpy

HIS = (0.353, 0.635, 1.0)                      # the keeper's lamp: the colour reserved for him
WARM = (1.0, 0.62, 0.30)                       # candle light


def args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default="BLENDER_EEVEE")
    ap.add_argument("--out", default="out/look.png")
    ap.add_argument("--w", type=int, default=1280)
    ap.add_argument("--h", type=int, default=720)
    ap.add_argument("--samples", type=int, default=64)
    ap.add_argument("--save", default="")
    ap.add_argument("--repeat", type=int, default=1)
    ap.add_argument("--haze", type=float, default=-1.0)
    ap.add_argument("--threshold", type=float, default=0.03)
    ap.add_argument("--denoiser", default="OPENIMAGEDENOISE")
    return ap.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])


# ---------------------------------------------------------------- helpers
def lathe(name, profile, seg=64, smooth=True):
    """A solid of revolution about Z from a profile [(radius, height), ...], bottom to top."""
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
    if smooth:
        me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    return ob


def material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    return m, nt, nt.nodes.new("ShaderNodeOutputMaterial")


def principled(nt, out, **vals):
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    for k, v in vals.items():
        if k in b.inputs:
            b.inputs[k].default_value = v
        else:
            print("LOOK: principled has no input", k)
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    return b


def wood():
    m, nt, out = material("wood")
    b = principled(nt, out, Roughness=0.42)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.7, 9.0, 1.0)             # long grain along X
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 6.0
    nz.inputs["Detail"].default_value = 8.0
    nz.inputs["Roughness"].default_value = 0.62
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


def wax():
    m, nt, out = material("wax")
    principled(nt, out, **{"Base Color": (0.93, 0.87, 0.74, 1), "Roughness": 0.55, "Subsurface Weight": 1.0,
                           "Subsurface Radius": (1.0, 0.55, 0.28), "Subsurface Scale": 0.035})
    return m


def brass():
    m, nt, out = material("brass")
    principled(nt, out, **{"Base Color": (0.78, 0.55, 0.24, 1), "Metallic": 1.0, "Roughness": 0.32})
    return m


def dark(name="dark", col=(0.02, 0.016, 0.012, 1)):
    m, nt, out = material(name)
    principled(nt, out, **{"Base Color": col, "Roughness": 0.9})
    return m


def glass(tint):
    """Thin tinted glass: clear where you look straight through it, bright at the grazing edges."""
    m, nt, out = material("glass")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*tint, 1)
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Color"].default_value = (*tint, 1)
    gl.inputs["Roughness"].default_value = 0.06
    fr = nt.nodes.new("ShaderNodeLayerWeight")
    fr.inputs["Blend"].default_value = 0.22
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(fr.outputs["Fresnel"], mix.inputs["Fac"])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(gl.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    for attr, val in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
        if hasattr(m, attr):
            try:
                setattr(m, attr, val)
            except Exception as ex:
                print("LOOK:", attr, ex)
    return m


def flame_mat(tip, core):
    """A flame: bright core low down, colour toward the tip, soft at the edges and at the very base."""
    m, nt, out = material("flame")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    col = nt.nodes.new("ShaderNodeValToRGB")
    e = col.color_ramp.elements
    e[0].position, e[0].color = 0.0, (0.25, 0.45, 1.0, 1)             # the blue foot of a flame
    e[1].position, e[1].color = 1.0, (*tip, 1)
    e.new(0.16).color = (*core, 1)
    e.new(0.55).color = (1.0, 0.80, 0.42, 1)
    nt.links.new(sep.outputs["Z"], col.inputs["Fac"])
    stren = nt.nodes.new("ShaderNodeValToRGB")
    s = stren.color_ramp.elements
    s[0].position, s[0].color = 0.0, (0.05, 0.05, 0.05, 1)
    s[1].position, s[1].color = 1.0, (0.25, 0.25, 0.25, 1)
    s.new(0.22).color = (1, 1, 1, 1)
    nt.links.new(sep.outputs["Z"], stren.inputs["Fac"])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = 55.0
    nt.links.new(stren.outputs["Color"], mul.inputs[0])
    em = nt.nodes.new("ShaderNodeEmission")
    nt.links.new(col.outputs["Color"], em.inputs["Color"])
    nt.links.new(mul.outputs[0], em.inputs["Strength"])
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.35
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lw.outputs["Facing"], mix.inputs["Fac"])                 # facing the camera: flame; edge-on: clear
    nt.links.new(em.outputs[0], mix.inputs[1])
    nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    for attr, val in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
        if hasattr(m, attr):
            try:
                setattr(m, attr, val)
            except Exception as ex:
                print("LOOK:", attr, ex)
    return m


def flame(name, at, h, r, mat, light_col, watts):
    """A flame and the light it gives. `at` is the foot of the flame."""
    prof = [(r * k, h * z) for k, z in ((0.0, 0.0), (0.55, 0.04), (0.92, 0.14), (1.0, 0.26), (0.90, 0.40), (0.66, 0.58),
                                        (0.38, 0.76), (0.15, 0.90), (0.0, 1.0))]
    ob = lathe(name, prof, seg=32)
    ob.location = at
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    li = bpy.data.lights.new(name + "_light", "POINT")
    li.energy, li.color, li.shadow_soft_size = watts, light_col, r * 1.1
    for attr, val in (("use_shadow_jitter", True), ("use_soft_falloff", True)):
        if hasattr(li, attr):
            setattr(li, attr, val)
    lo = bpy.data.objects.new(name + "_light", li)
    lo.location = (at[0], at[1], at[2] + h * 0.42)
    bpy.context.collection.objects.link(lo)
    return ob, lo


def candle(at, height=0.15, r=0.031):
    x, y, z = at
    body = lathe("candle", [(0.0, 0.0), (r, 0.0), (r, height - 0.004), (r * 0.94, height), (r * 0.70, height - 0.006),
                            (0.0, height - 0.009)], seg=64)
    body.location = at
    body.data.materials.append(wax())
    wick = lathe("wick", [(0.0, 0.0), (0.0012, 0.0), (0.0012, 0.014), (0.0, 0.015)], seg=8)
    wick.location = (x, y, z + height - 0.009)
    wick.data.materials.append(dark())
    return flame("candle_flame", (x, y, z + height - 0.001), 0.048, 0.0105, flame_mat((1.0, 0.52, 0.14), (1.0, 0.95, 0.80)),
                 WARM, 3.2)


def lamp(at, tint=HIS):
    x, y, z = at
    base = lathe("lamp_base", [(0.0, 0.0), (0.060, 0.0), (0.062, 0.006), (0.046, 0.016), (0.030, 0.024), (0.040, 0.040),
                               (0.056, 0.062), (0.052, 0.084), (0.034, 0.098), (0.030, 0.108), (0.033, 0.112),
                               (0.033, 0.122), (0.0, 0.122)], seg=64)
    base.location = at
    base.data.materials.append(brass())
    ch = lathe("lamp_chimney", [(0.031, 0.118), (0.036, 0.130), (0.052, 0.160), (0.056, 0.185), (0.048, 0.215),
                                (0.034, 0.245), (0.027, 0.275), (0.026, 0.330), (0.0275, 0.332), (0.0285, 0.275),
                                (0.0355, 0.245), (0.0495, 0.215), (0.0575, 0.185), (0.0535, 0.160), (0.0375, 0.130),
                                (0.0325, 0.118)], seg=64)
    ch.location = at
    ch.data.materials.append(glass(tuple(0.45 + 0.55 * c for c in tint)))
    ch.visible_shadow = False
    light_col = tuple(0.22 * w + 0.78 * c for w, c in zip((1.0, 0.80, 0.55), tint))
    return flame("lamp_flame", (x, y, z + 0.124), 0.050, 0.011, flame_mat((0.55, 0.72, 1.0), (0.92, 0.96, 1.0)), light_col, 3.6)


def haze(density):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.3, 0.55))
    ob = bpy.context.object
    ob.name = "haze"
    ob.scale = (3.2, 3.2, 1.6)
    m, nt, out = material("haze")
    v = nt.nodes.new("ShaderNodeVolumeScatter")
    v.inputs["Density"].default_value = density
    v.inputs["Anisotropy"].default_value = 0.35
    v.inputs["Color"].default_value = (0.9, 0.85, 0.8, 1)
    nt.links.new(v.outputs[0], out.inputs["Volume"])
    ob.data.materials.append(m)
    ob.visible_shadow = False
    return ob


def bloom(sc, strength=0.6, size=0.62, threshold=1.2, wide=0.22):
    """The glow round a flame, added after the render (the 5.x compositor is a node group on the scene). Two passes: a
    tight one for the flame's edge and a wide, faint one for the air round it. No noise is added anywhere."""
    ng = bpy.data.node_groups.new("glow", "CompositorNodeTree")
    ng.interface.new_socket(name="Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    rl = ng.nodes.new("CompositorNodeRLayers")
    out = ng.nodes.new("NodeGroupOutput")
    last = rl.outputs["Image"]
    for st, sz, th in ((strength, size, threshold), (wide, 0.95, threshold * 0.6)):
        g = ng.nodes.new("CompositorNodeGlare")
        g.inputs["Type"].default_value = "Bloom"
        g.inputs["Quality"].default_value = "High"
        g.inputs["Threshold"].default_value = th
        g.inputs["Smoothness"].default_value = 0.4
        g.inputs["Strength"].default_value = st
        g.inputs["Size"].default_value = sz
        ng.links.new(last, g.inputs["Image"])
        last = g.outputs["Image"]
    ng.links.new(last, out.inputs[0])
    sc.compositing_node_group = ng
    sc.render.use_compositing = True


# ---------------------------------------------------------------- the scene
def build(a):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = a.engine
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = a.w, a.h, 100
    sc.render.image_settings.file_format = "PNG"
    sc.render.film_transparent = False
    world = bpy.data.worlds.new("night")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.0025, 0.0020, 0.0022, 1)
    sc.world = world
    sc.view_settings.view_transform = "AgX"
    try:
        sc.view_settings.look = "AgX - Medium High Contrast"
    except TypeError as ex:
        print("LOOK: look not set:", ex)
    sc.view_settings.exposure = 0.6

    # the table, and a back wall far enough away to stay almost black
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -0.02))
    table = bpy.context.object
    table.name = "table"
    table.scale = (1.7, 0.85, 0.04)
    table.data.materials.append(wood())
    bpy.ops.mesh.primitive_plane_add(size=12.0, location=(0, 3.6, 1.0), rotation=(math.radians(90), 0, 0))
    wall = bpy.context.object
    wall.name = "wall"
    wall.data.materials.append(dark("wall", (0.020, 0.016, 0.014, 1)))

    candle((-0.21, 0.0, 0.0))
    lamp((0.22, 0.04, 0.0))
    hz = a.haze if a.haze >= 0 else (0.045 if a.engine == "BLENDER_EEVEE" else 0.05)
    if hz > 0:
        haze(hz)

    cam = bpy.data.cameras.new("cam")
    cam.lens, cam.sensor_width = 58.0, 36.0
    cam.dof.use_dof, cam.dof.aperture_fstop = True, 2.4
    co = bpy.data.objects.new("cam", cam)
    co.location = (0.02, -1.18, 0.44)
    bpy.context.collection.objects.link(co)
    target = bpy.data.objects.new("target", None)
    target.location = (0.0, 0.0, 0.135)
    bpy.context.collection.objects.link(target)
    tr = co.constraints.new("TRACK_TO")
    tr.target, tr.track_axis, tr.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
    cam.dof.focus_object = target
    sc.camera = co

    if a.engine == "CYCLES":
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "OPTIX"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type == "OPTIX"
        sc.cycles.device = "GPU"
        sc.cycles.samples = a.samples
        sc.cycles.use_adaptive_sampling = True
        sc.cycles.use_denoising = True
        sc.cycles.adaptive_threshold = a.threshold
        sc.cycles.sample_clamp_indirect = 4.0
        sc.cycles.caustics_reflective = False
        sc.cycles.caustics_refractive = False
        for attr, val in (("denoising_use_gpu", True), ("denoising_prefilter", "ACCURATE"), ("use_light_tree", True)):
            if hasattr(sc.cycles, attr):
                setattr(sc.cycles, attr, val)
        sc.render.use_persistent_data = True
        for den in (a.denoiser, "OPENIMAGEDENOISE", "OPTIX"):
            try:
                sc.cycles.denoiser = den
                break
            except TypeError:
                continue
        sc.cycles.volume_bounces = 1
        sc.cycles.max_bounces = 6
    else:
        ee = sc.eevee
        for attr, val in (("taa_render_samples", a.samples), ("use_raytracing", True), ("use_shadows", True),
                          ("volumetric_tile_size", "2"), ("volumetric_samples", 128), ("volumetric_start", 0.1),
                          ("volumetric_end", 6.0), ("use_volumetric_shadows", True), ("volumetric_shadow_samples", 32),
                          ("shadow_ray_count", 3), ("shadow_step_count", 8)):
            if hasattr(ee, attr):
                try:
                    setattr(ee, attr, val)
                except Exception as ex:
                    print("LOOK: eevee", attr, ex)
            else:
                print("LOOK: eevee has no", attr)
    bloom(sc)
    return sc


if __name__ == "__main__":
    a = args()
    sc = build(a)
    sc.render.filepath = bpy.path.abspath("//" + a.out) if not a.out[1:3] == ":\\" and not a.out.startswith("/") else a.out
    if a.save:
        bpy.ops.wm.save_as_mainfile(filepath=a.save)
    for _ in range(a.repeat):
        t0 = time.time()
        bpy.ops.render.render(write_still=True)
        print(f"LOOK: rendered {a.engine} {a.w}x{a.h} samples {a.samples} in {time.time() - t0:.2f} s -> {sc.render.filepath}")
