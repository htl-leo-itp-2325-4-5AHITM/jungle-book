package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.repository.JournalRepository;
import io.quarkus.runtime.Quarkus;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import org.jboss.logging.Logger;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import java.io.IOException;

@Path("/api/journal")
public class JournalResource {
    private static final Logger LOG = Logger.getLogger(Quarkus.class);

    @Inject
    JournalRepository journalRepository;


    @POST
    @Path("/upload-photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response uploadImage(@MultipartForm MultipartFormDataInput image) throws IOException {
        byte[] imageBytes = image.getFormDataPart("image", byte[].class, null);
        return Response
                .ok(journalRepository.addJournal(imageBytes), MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition", "attachment; filename = new.pdf")
                .build();
    }
}
