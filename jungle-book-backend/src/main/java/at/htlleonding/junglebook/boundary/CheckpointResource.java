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

    /**
     * Add a new checkpoint to the database
     *
     * @param checkpoints a string of checkpoints in CSV format
     */
    @POST
    @Path("/add-checkpoints")
    @Consumes(MediaType.TEXT_PLAIN)
    public void addCheckpoints(String checkpoints) {
        checkpointRepository.addCheckpoints(checkpoints);
    }

    /**
     * Remove a checkpoint from the database
     *
     * @param id the id of the checkpoint to remove
     */
    @GET
    @Path("/remove-checkpoint?id={id}")
    public void removeCheckpoints(@PathParam("id") long id) {
        checkpointRepository.removeCheckpoint(id);
    }

    /**
     * Edit a checkpoint in the database
     *
     * @param checkpoint the edited checkpoint
     */
    @POST
    @Path("/edit-checkpoint")
    @Consumes(MediaType.TEXT_PLAIN)
    public void editCheckpoint(String checkpoint) {
        checkpointRepository.editCheckpoint(checkpoint);
    }

    /**
     * Get all checkpoints from the database
     *
     * @return a list of all checkpoints
     */
    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Checkpoint> getAllCheckpoints() {
        return checkpointRepository.getAllCheckpoints();
    }

    /**
     * Get a checkpoint by its id
     *
     * @param id the id of the checkpoint
     * @return the checkpoint with the given id
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Checkpoint getCheckpointById(@PathParam("id") long id) {
        return checkpointRepository.getCheckpointById(id);
    }
}
