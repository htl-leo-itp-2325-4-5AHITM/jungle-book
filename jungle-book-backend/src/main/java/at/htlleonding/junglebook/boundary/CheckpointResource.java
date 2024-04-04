package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.model.Checkpoint;
import at.htlleonding.junglebook.repository.CheckpointRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/checkpoint")
public class CheckpointResource {
    @Inject
    CheckpointRepository checkpointRepository;

    @POST
    @Path("/add-checkpoints")
    @Consumes(MediaType.TEXT_PLAIN)
    public void addCheckpoints(String checkpoints) {
        checkpointRepository.addCheckpoints(checkpoints);
    }
    @GET
    @Path("/remove-checkpoint?id={id}")
    public void removeCheckpoints(@PathParam("id") long id) {
        checkpointRepository.removeCheckpoint(id);
    }
    @POST
    @Path("/edit-checkpoint")
    @Consumes(MediaType.TEXT_PLAIN)
    public void editCheckpoint(String checkpoint) {
        checkpointRepository.editCheckpoint(checkpoint);
    }


    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Checkpoint> getAllCheckpoints() {
        return checkpointRepository.getAllCheckpoints();
    }
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Checkpoint getCheckpointById(@PathParam("id") long id) {
        return checkpointRepository.getCheckpointById(id);
    }
}
