# future_experiments: journal

Append-only. One entry for each thing saved here. An entry gives the facts of what was saved (source, time, size,
digest) and says nothing about what is in it.

## 2026-11-13, 06:51 local (machine L): the librarian's transcript, as it stood

- **At whose word:** the keeper's, to the Third Place, at 06:49: "can you some how save the libs current transcript
  into lighthouse repo under future experiments", and then "dont read into it just document and journal the
  transcript without analyzation".
- **What:** `librarian_0c0c0c0b_2026-11-13_0650L.jsonl.gz`, a gzip of the librarian seat's conversation file.
- **Source:** `~/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl` on L.
  The seat was running and went on writing after the copy. This is the file up to the moment of the copy.
- **Copied:** 2026-11-13 06:50:47 local, by `cp`, then `gzip -9`.
- **Unpacked:** 280,877,098 bytes, 86,568 lines, ending on a complete line.
  sha256 `de53d76c4ba26b7bfd198080b02239cd471e17f739106e4053ecfb80d4d3b8f1`.
- **As stored:** 85,189,511 bytes.
  sha256 `3015603179eb48bcf4e61f94b6e3aa282ae3261d6439c7f3e1b226b28cb8de1a`. `gzip -t` passes, and unpacking it gives
  the sha256 above.
- **First and last stamps in it:** `2026-09-01T13:36:17.124Z` and `2026-11-13T12:49:29.159Z`.
- **Not done:** nothing in it was read, searched or summarised. The two stamps and the counts are all that was taken.
- **State in git:** on disk in the working tree; not staged and not committed. It is named in `.git/info/exclude` on
  L, so an ordinary `git add` passes over it and `git add -f` takes it on purpose. On the day of this entry GitHub
  reports the repository PUBLIC (`gh repo view`), and GitHub refuses a file over 100 MB.
- **To unpack:** `gzip -dc librarian_0c0c0c0b_2026-11-13_0650L.jsonl.gz > 0c0c0c0b-0000-4000-8000-00000000115b.jsonl`

## 2026-11-13, 06:57 local (machine L): the same transcript, stored encrypted and committed

- **At whose word:** the keeper's. Told the file was saved and not committed, he wrote "wym its not commited, make
  sure its there so the desktop could see it for an example". Asked where it should go, given that the repository
  is public, he chose: in lighthouse, encrypted.
- **What is in this folder now:** `librarian_0c0c0c0b_2026-11-13_0650L.jsonl.gz.enc`, 85,189,536 bytes,
  sha256 `da6b3beacee84fbb1ad5ae528ce2734db7119a2d8fec9af71ceac859912052d7`. It is the gzip of the entry above,
  encrypted with `openssl enc -aes-256-cbc -pbkdf2 -iter 600000 -salt` (OpenSSL 3.5.5).
- **Checked:** decrypted with the passphrase it gives back sha256 `3015603179eb48bc…` (the gzip above, whole);
  with a wrong passphrase openssl exits 1 with "bad decrypt".
- **The unencrypted gzip** is no longer in this folder. It was moved to `private/future_experiments/` on L, beside
  the passphrase. The entry above describes it as it was at 06:51.
- **The passphrase** is in `private/future_experiments/passphrase_librarian_2026-11-13.txt` on L: one line, six
  groups of five characters. It is in no repository and was never printed. It reaches another machine only by the
  keeper's own hand.
- **To open it on another machine** (Git Bash; with this openssl a path after `file:` must be written `C:/...`,
  and `/c/...` fails):

      openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in librarian_0c0c0c0b_2026-11-13_0650L.jsonl.gz.enc -out librarian.jsonl.gz -pass file:C:/path/to/passphrase.txt
      sha256sum librarian.jsonl.gz     # 3015603179eb48bcf4e61f94b6e3aa282ae3261d6439c7f3e1b226b28cb8de1a
      gzip -dc librarian.jsonl.gz > 0c0c0c0b-0000-4000-8000-00000000115b.jsonl

- **Checked before committing, by count only:** no string shaped like an API key or token is in the transcript
  (one match for a key shape lies inside a run of base64 data). Nothing else in it was read.
