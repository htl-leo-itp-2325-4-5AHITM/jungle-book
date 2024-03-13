package at.htlleonding.junglebook.repository;

import at.htlleonding.junglebook.model.Checkpoint;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class CheckpointRepository {
    @Inject
    EntityManager entityManager;
    public List<Checkpoint> getAllCheckpoints() {
        return entityManager.createNamedQuery(Checkpoint.QUERY_GET_ALL, Checkpoint.class).getResultList();
    }

    @Transactional
    public void addCheckpoints(String checkpointsRaw) {
        String[] checkpoints = checkpointsRaw.split("\n");
        for(String checkpoint : checkpoints) {
            String[] checkpointData = checkpoint.split(";");
            entityManager.persist(new Checkpoint(checkpointData[0], checkpointData[1], checkpointData[2], checkpointData[3], checkpointData[4]));
        }
    }

    @Transactional
    public void removeCheckpoint(long id) {
        entityManager.remove(getCheckpointById(id));
    }

    public Checkpoint getCheckpointById(long id) {
        return entityManager.find(Checkpoint.class, id);
    }

    public void editCheckpoint(String checkpoint) {
        removeCheckpoint(checkpoint.charAt(0) - 'a');
        addCheckpoints(checkpoint);
    }
}
