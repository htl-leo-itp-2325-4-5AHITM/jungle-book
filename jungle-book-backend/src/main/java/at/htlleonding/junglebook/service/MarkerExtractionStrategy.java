package at.htlleonding.junglebook.service;

import com.itextpdf.text.pdf.parser.LocationTextExtractionStrategy;
import com.itextpdf.text.pdf.parser.TextRenderInfo;
import com.itextpdf.text.pdf.parser.Vector;

public class MarkerExtractionStrategy extends LocationTextExtractionStrategy {
    private final String marker;
    private Vector markerStart;
    private Vector markerEnd;

    public MarkerExtractionStrategy(String marker) {
        this.marker = marker;
    }

    @Override
    public void renderText(TextRenderInfo renderInfo) {
        super.renderText(renderInfo);
        String textChunk = renderInfo.getText();
        if (textChunk != null && textChunk.contains(marker)) {
            // Optionally, you could refine this to handle cases where the marker is part of a larger chunk.
            markerStart = renderInfo.getDescentLine().getStartPoint();
            markerEnd = renderInfo.getAscentLine().getEndPoint();
        }
    }

    public Vector getMarkerStart() {
        return markerStart;
    }

    public Vector getMarkerEnd() {
        return markerEnd;
    }
}
