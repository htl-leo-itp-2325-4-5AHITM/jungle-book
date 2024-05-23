package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.model.Journal;
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
import java.util.Base64;
import java.util.List;

@Path("/journal")
public class JournalResource {
    @Inject
    JournalRepository journalRepository;

    /**
     * Uploads a image to the server
     * @param image the image to upload
     * @return a generated pdf
     */
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
    @POST
    @Path("/upload-photo-json")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public void uploadImageJson(String imageData) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(imageData);
        journalRepository.addJournal(imageBytes);
    }
    /**
     * Returns all journals
     * @return a list of all journals
     */
    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Journal> getAllJournals() {
        return journalRepository.getAllJournals();
    }
}
