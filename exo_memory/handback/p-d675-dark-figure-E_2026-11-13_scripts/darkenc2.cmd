@echo off
rem darkenc.cmd: the Dark's clips (pane E, D675): side by side and each side full size, 144 frames a second, both commits
rem in the metadata.
set FF=C:\Users\nname\Downloads\always_returning\node_modules\ffmpeg-static\ffmpeg.exe
set O=G:\consonance-scratch\e-dark-film-landed
set M=before ba2755462db5326441d84cd4945b224b802708af (main just before the Dark) ^| after e0fcdec40a7029965889b4e269cef13b41e9a7a6 (main with the Dark landed) ^| seed 1, level 1, flee bot, 45 s timer, from 53.01 s ^| 144 frames a second
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\base\dark_film_%%03d.png -framerate 144 -i %O%\branch\dark_film_%%03d.png -filter_complex "[0:v]scale=960:-2[a];[1:v]scale=960:-2[b];[a][b]hstack=inputs=2[v]" -map "[v]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="%M%" %O%\the_dark_before_after_144fps.mp4 || exit /b 1
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\base\dark_film_%%03d.png -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="before ba2755462db5326441d84cd4945b224b802708af; 144 frames a second" %O%\the_dark_before_full_144fps.mp4 || exit /b 1
%FF% -hide_banner -loglevel error -y -framerate 144 -i %O%\branch\dark_film_%%03d.png -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -r 144 -metadata comment="after e0fcdec40a7029965889b4e269cef13b41e9a7a6; 144 frames a second" %O%\the_dark_after_full_144fps.mp4 || exit /b 1
echo encoded
