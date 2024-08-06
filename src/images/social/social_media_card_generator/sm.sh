#!/bin/bash

IMAGES=(acerca
        cambios
        charts
        colonias
        comparar-colonias
        crimen
        cuadrantes-mapa
        dia
        hora
        index
        mapa
        sectores-mapa
        numero
        rumbo
        tasas
        tendencias
        privacidad)

TITLES=("Acerca\nde"
        "Cambios\nCriminales\npor\nSector"
        "Tasas\npor\nSector\nDelictivo"
        "Crimen\npor\ntu\nColonia"
        "Comparar\nCrímenes\npor\nColonia"
        "Tasas\npor\nTipo\nde\nCrimen"
        "Crimen\npor\nCuadrante"
        "Crimen\npor\nDía\nde la\nSemana"
        "Crimen\npor\nHora"
        "Crimen\nen la\nCiudad\nde\nMéxico"
        "Mapa\nCriminal\nde la\nCiudad de\nMéxico"
        "Crimen\npor\nSector"
        "Número\nde\nCrímenes\npor\nSector"
        "Crimen\npor\ntu\nRumbo"
        "Tasas\nde\nCrimen"
        "Tendencias\nCriminales"
        "Privacidad"
)

TITLES_EN=("About"
        "Change\nin\nCrime\nRates"
        "Crime\nRates\nby\nSector"
        "Crime\nin\nyour\nNeighbor-\nhood"
        "Compare\nCrime\nby\nNeighbor-\nhood"
        "Rates\nby\nType\nof\nCrime"
        "Crime\nby\nCuadrante"
        "Crime\nby\nDay\nof\nWeek"
        "Crime\nby\nHour"
        "Crime\nin\nMexico\nCity"
        "Map of\nCrime in\nMexico\nCity"
        "Crime\nby\nSector"
        "Number\nof\nCrimes\nby\nSector"
        "Crime\nin\nyour\nLocation"
        "Crime\nRates\nby\nSector"
        "Crime\nTrends\nin\nMexico\nCity"
        "Privacy"
)
WW=1200
HH=628
SLIDE_BGCOLOR="#ff5f00"
BORDER_COLOR="#999999"
TITLE_FONT=fonts/Raleway-ExtraBold.ttf
ATTRIBUTION_FONT=fonts/Merriweather-Bold.ttf

for ((i = 0; i < ${#IMAGES[@]}; ++i)); do
        echo "generating social card for ""${IMAGES[i]}"
        TMP1=$(mktemp).png
        TMP2=$(mktemp).png
        TMP3=$(mktemp).png
        TMP4=$(mktemp).png
        SLIDE=$(mktemp).png
        LOGO=$(mktemp).png
        SLIDE_WITH_LOGO=$(mktemp).png
        RESIZED=$(mktemp).png

        convert -resize "$WW"x"$HH"'^' screenshots/"${IMAGES[i]}.png" "$RESIZED"
        #inname=$(convert "$IMAGE" -format "%t" info:)
        convert "$RESIZED" -canny 0x1+10%+30% "$TMP1"
        coords=$(compare -metric rmse -subimage-search -dissimilarity-threshold 1 \
                "$TMP1" \( -size ${WW}x${HH} xc:white \) null: 2>&1 | cut -d\  -f4)
        XOFF=$(echo "$coords" | cut -d, -f1)
        YOFF=$(echo "$coords" | cut -d, -f2)
        convert screenshots/"${IMAGES[i]}.png" -crop "${WW}x${HH}+${XOFF}+${YOFF}" \
                +repage "$TMP2"

        convert -size "$WW"x"$HH" xc:transparent -fill "$SLIDE_BGCOLOR" \
                -stroke $BORDER_COLOR -strokewidth .7 -draw "polygon  0,0 470,0 332,629 0,629" \
                -stroke $BORDER_COLOR -strokewidth .7 -fill transparent -draw "polygon  0,0 1199,0 1199,627 0,627" \
                -stroke $BORDER_COLOR -strokewidth .7 -fill white -draw "polygon  470,0 485,0 347,627 332,627" "$SLIDE"
        convert -size 200x40 -resize 400x80 -background none logos/logo.svg "$LOGO"
        composite -compose atop -geometry +15+30 "$LOGO" "$SLIDE" "$SLIDE_WITH_LOGO"

        composite -compose atop "$SLIDE_WITH_LOGO" "$TMP2" "$TMP3"
        convert -font "$TITLE_FONT" -pointsize 60 \
                -fill black -annotate +15+155 "${TITLES[i]}" \
                "$TMP3" "$TMP4"
        convert -strip -define jpeg:dct-method=float -interlace JPEG -quality 90% \
                -font "$ATTRIBUTION_FONT" -pointsize 39 -fill "#111111" \
                -annotate +15+540 "por @diegovalle" "$TMP4" "../social-${IMAGES[i]}.jpg"
done

for ((i = 0; i < ${#IMAGES[@]}; ++i)); do
        echo "generating social card for ""${IMAGES[i]}_en"
        TMP1=$(mktemp).png
        TMP2=$(mktemp).png
        TMP3=$(mktemp).png
        TMP4=$(mktemp).png
        SLIDE=$(mktemp).png
        LOGO=$(mktemp).png
        SLIDE_WITH_LOGO=$(mktemp).png
        RESIZED=$(mktemp).png

        convert -resize "$WW"x"$HH"'^' screenshots/"${IMAGES[i]}.png" "$RESIZED"
        #inname=$(convert "$IMAGE" -format "%t" info:)
        convert "$RESIZED" -canny 0x1+10%+30% "$TMP1"
        coords=$(compare -metric rmse -subimage-search -dissimilarity-threshold 1 \
                "$TMP1" \( -size ${WW}x${HH} xc:white \) null: 2>&1 | cut -d\  -f4)
        XOFF=$(echo "$coords" | cut -d, -f1)
        YOFF=$(echo "$coords" | cut -d, -f2)
        convert screenshots/"${IMAGES[i]}.png" -crop "${WW}x${HH}+${XOFF}+${YOFF}" \
                +repage "$TMP2"

        convert -size "$WW"x"$HH" xc:transparent -fill "$SLIDE_BGCOLOR" \
                -stroke $BORDER_COLOR -strokewidth .7 -draw "polygon  0,0 470,0 332,629 0,629" \
                -stroke $BORDER_COLOR -strokewidth .7 -fill transparent -draw "polygon  0,0 1199,0 1199,627 0,627" \
                -stroke $BORDER_COLOR -strokewidth .7 -fill white -draw "polygon  470,0 485,0 347,627 332,627" "$SLIDE"
        convert -size 200x40 -resize 400x80 -background none logos/logo.svg "$LOGO"
        composite -compose atop -geometry +15+30 "$LOGO" "$SLIDE" "$SLIDE_WITH_LOGO"

        composite -compose atop "$SLIDE_WITH_LOGO" "$TMP2" "$TMP3"
        convert -font "$TITLE_FONT" -pointsize 60 \
                -fill black -annotate +15+155 "${TITLES_EN[i]}" \
                "$TMP3" "$TMP4"
        convert -strip -define jpeg:dct-method=float -interlace JPEG -quality 90% \
                -font "$ATTRIBUTION_FONT" -pointsize 39 -fill "#111111" \
                -annotate +15+540 "by @diegovalle" "$TMP4" "../social-${IMAGES[i]}_en.jpg"
done
