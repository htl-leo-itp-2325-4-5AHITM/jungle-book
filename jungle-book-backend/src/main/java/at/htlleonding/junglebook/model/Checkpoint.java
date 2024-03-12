package at.htlleonding.junglebook.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Checkpoint {
    @GeneratedValue
    @Id
    private long id;

    private String name;
    private String longitude;
    private String latitude;
    private String comment;
    private String note;

    public long getId() {
        return id;
    }
}
