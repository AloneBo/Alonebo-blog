

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
  at_title varchar (200) not null, -- 标题
  at_content text not null, -- 文章内容
  at_cate varchar(100) not null, -- 类别
--   at_content_src text not null,
  at_summary text not null, -- 摘要
  at_update_time  timestamp(0) without time zone default current_timestamp, -- 更新时间
  at_create_time timestamp(0) without time zone default current_timestamp -- 创建时间
);

-- DROP TABLE IF EXISTS tb_category;
--
-- create table tb_category (
--   id serial primary key,
--   ct_title varchar (200) not null
-- );
--
-- DROP TABLE IF EXISTS tb_recent_posts;
--
-- create table tb_recent_posts (
--   id serial primary key,
--   rp_title varchar (200) not null,
--   rp_update_time timestamp(0) without time zone not null,
--   rp_cate varchar(100) not null
-- );


-- insert into tb_article(at_title,at_content,at_cate,at_update_time,at_create_time) values
-- insert into tb_article(at_title,at_content,at_cate) values

DROP TABLE IF EXISTS tb_english_word;
create table tb_english_word (
   id serial primary key,
   ew_en text not null,
   ew_trans text not null,
   ew_sound text not null
);