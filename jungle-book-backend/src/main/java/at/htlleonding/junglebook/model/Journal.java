package at.htlleonding.junglebook.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.io.File;

@Entity
public class Journal {
    @GeneratedValue
    @Id
    private Long id;
    private Long userId;
    private String coordinates;
    private String journalName;

    private File image;
}
