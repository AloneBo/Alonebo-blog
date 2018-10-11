-- Copyright 2009 FriendFeed
--
-- Licensed under the Apache License, Version 2.0 (the "License"); you may
-- not use this file except in compliance with the License. You may obtain
-- a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
-- WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
-- License for the specific language governing permissions and limitations
-- under the License.

-- To create the database:
--   CREATE DATABASE alonebo_blog;
--   CREATE USER blog WITH PASSWORD 'alonebo';
--   GRANT ALL ON DATABASE blog TO blog;
--
-- To reload the tables:
--   psql -U blog -d blog < schema.sql

DROP TABLE IF EXISTS tb_user;

create table tb_user (
    id serial primary key,
    u_name VARCHAR(100) NOT NULL,
    u_passwd varchar(200) not null
);

-- insert into tb_user(u_name,u_passwd) values ('alonebo', 'alonebo');

DROP TABLE IF EXISTS tb_article;

create table tb_article (
  id serial primary key,
  at_title varchar (200) not null,
  at_content text not null,
  at_cate varchar(100) not null,
  at_content_src text not null,
  at_summary text not null,
  at_update_time  timestamp(0) without time zone default current_timestamp,
  at_create_time timestamp(0) without time zone default current_timestamp
);

DROP TABLE IF EXISTS tb_category;

create table tb_category (
  id serial primary key,
  ct_title varchar (200) not null
);

DROP TABLE IF EXISTS tb_recent_posts;

create table tb_recent_posts (
  id serial primary key,
  rp_title varchar (200) not null,
  rp_update_time timestamp(0) without time zone not null,
  rp_cate varchar(100) not null
);


-- insert into tb_article(at_title,at_content,at_cate,at_update_time,at_create_time) values
-- insert into tb_article(at_title,at_content,at_cate) values

DROP TABLE IF EXISTS tb_english_word;
create table tb_english_word (
   id serial primary key,
   ew_en text not null,
   ew_trans text not null,
   ew_sound text not null
);