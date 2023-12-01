package at.htlleonding.junglebook.repository;

import io.quarkus.runtime.Quarkus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.util.Arrays;

@ApplicationScoped
public class JournalRepository {
    private static final Logger LOG = Logger.getLogger(Quarkus.class);

    @Inject
    EntityManager entityManager;

    @Transactional
    public byte[] addJournal(byte[] image) throws IOException {
        PDDocument document = new PDDocument();
        document.addPage(new PDPage());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();

        PDPage page = document.getPage(0); // get the first page
        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, image, "image");

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
            contentStream.drawImage(pdImage, 20, 20);
        }
        return baos.toByteArray();
    }
}
