package at.htlleonding.junglebook.service;

import at.htlleonding.junglebook.model.Journal;
import jakarta.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDSimpleFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.PDFTextStripperByArea;

import java.awt.geom.Rectangle2D;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class PhotobookGenerator {
    public byte[] getPhotobook(List<Journal> journals) throws IOException {
        PDDocument document;
        try (InputStream is = getClass().getResourceAsStream("/pdf/Photobook design.pdf")) {
            assert is != null;
            byte[] byteArray = is.readAllBytes();
            document = Loader.loadPDF(byteArray);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        for(int i = 0; i <  document.getNumberOfPages() - 1; i++) {
            PDPage page = document.getPage(i);

            PDRectangle cropBox = page.getCropBox();
            float pageHeight = cropBox.getHeight();

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {

                // Add new text
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.newLineAtOffset(100, pageHeight - 500); // Adjust position
                if (!journals.isEmpty()) {
                    contentStream.showText(journals.get(i).getName());
                    contentStream.endText();

                    PDImageXObject image = PDImageXObject.createFromFile(String.format("/media/jungle-book/%d.jpg", journals.get(i).getId()), document);
                    contentStream.drawImage(image, 100, 500);
                }
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();

        return baos.toByteArray();
    }
}
