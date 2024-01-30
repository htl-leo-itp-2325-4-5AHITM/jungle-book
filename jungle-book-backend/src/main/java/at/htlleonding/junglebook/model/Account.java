package at.htlleonding.junglebook.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Account {
    @GeneratedValue
    @Id
    private long id;

}
