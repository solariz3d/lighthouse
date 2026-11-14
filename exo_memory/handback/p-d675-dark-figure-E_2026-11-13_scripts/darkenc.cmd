@echo off
rem darkenc.cmd: the Dark's clips (pane E, D675): side by side and each side full size, 144 frames a second, both commits
rem in the metadata.
set FF=C:\Users\nname\Downloads\always_returning\node_modules\ffmpeg-static\ffmpeg.exe
set O=G:\consonance-scratch\e-dark-film
set M=before 0eabefc9af10db76e38b3c38e60b616404e28d42 (main b08f25e's game, plus tools/ only) ^| after 16531504abd83d4c9fb2b2c7de490c5ba3836543 (dark-figure-e) ^| seed 1, level 1, flee bot, 45 s timer, from 53.01 s ^| 144 frames a second
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\base\dark_film_%%03d.png -framerate 144 -i %O%\branch\dark_film_%%03d.png -filter_complex "[0:v]scale=960:-2[a];[1:v]scale=960:-2[b];[a][b]hstack=inputs=2[v]" -map "[v]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="%M%" %O%\the_dark_before_after_144fps.mp4 || exit /b 1
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\base\dark_film_%%03d.png -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="before 0eabefc9af10db76e38b3c38e60b616404e28d42; 144 frames a second" %O%\the_dark_before_full_144fps.mp4 || exit /b 1
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\branch\dark_film_%%03d.png -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="after 16531504abd83d4c9fb2b2c7de490c5ba3836543; 144 frames a second" %O%\the_dark_after_full_144fps.mp4 || exit /b 1
echo encoded
