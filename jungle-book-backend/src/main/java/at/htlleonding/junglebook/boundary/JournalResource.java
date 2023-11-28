package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.repository.JournalRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.IOException;

@Path("/api/journal")
public class JournalResource {
    @Inject
    JournalRepository journalRepository;

    @POST
    @Path("/upload-photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response uploadImage(byte[] image) throws IOException {
        return Response
                .ok(journalRepository.addJournal(image), MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition", "attachment; filename = new.pdf")
                .build();
    }
}
