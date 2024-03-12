-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database
-- insert into myentity (id, field) values(1, 'field-1');
-- insert into myentity (id, field) values(2, 'field-2');
-- insert into myentity (id, field) values(3, 'field-3');
-- alter sequence myentity_seq restart with 4;
drop table journal;
drop table account;
drop table checkpoint;
create table account (
                         id int primary key
);
create table checkpoint(
                           id int primary key,
                           name varchar(255),
                           longitude varchar(255),
                           latitude varchar(255),
                           comment varchar(255),
                           note varchar(255)
);
create table journal (
    id int primary key,
    name varchar(255),
    account_id int,
    checkpoint_id int,
    foreign key (account_id) references account(id),
    foreign key (checkpoint_id) references checkpoint(id)
);

