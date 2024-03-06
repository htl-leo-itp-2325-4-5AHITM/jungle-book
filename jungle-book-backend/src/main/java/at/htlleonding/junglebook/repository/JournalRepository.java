package at.htlleonding.junglebook.repository;

import io.quarkus.runtime.Quarkus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jboss.logging.Logger;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@ApplicationScoped
public class JournalRepository {
    private static final Logger LOG = Logger.getLogger(Quarkus.class);
    @Inject
    EntityManager entityManager;

    @Transactional
    public byte[] addJournal(byte[] image) throws IOException {
        PDDocument document;
        try (InputStream is = getClass().getResourceAsStream("/pdf/Photobook design.pdf")) {
            byte[] byteArray = is.readAllBytes();
            document = Loader.loadPDF(byteArray);
        }
        PDPage page = document.getPage(0);
        LOG.info("page created");

        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, image, "image");

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
            contentStream.drawImage(pdImage, 50, 1000);
            LOG.info("image drawn");
        } catch (Exception e) {
            LOG.error("image draw failed");
            throw new RuntimeException(e);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();
        LOG.info("page saved and closed");

        return baos.toByteArray();
    }
}
