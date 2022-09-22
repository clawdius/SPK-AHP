/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     15/09/2022 21:30:01                          */
/*==============================================================*/

/*==============================================================*/
/* Table: AKTIVITAS_REKRUTMEN                                   */
/*==============================================================*/
create table AKTIVITAS_REKRUTMEN
(
   ID_AKTIVITAS         int not null AUTO_INCREMENT comment '',
   ID_REKRUTMEN         int not null  comment '',
   ID_CALON             int not null  comment '',
   TGL_DAFTAR           date not null  comment '',
   primary key (ID_AKTIVITAS)
);

/*==============================================================*/
/* Table: BOBOT_KRITERIA                                        */
/*==============================================================*/
create table BOBOT_KRITERIA
(
   ID_REKRUTMEN         int not null  comment '',
   ID_KRITERIA          int not null  comment '',
   BOBOT                int not null  comment '',
   primary key (ID_REKRUTMEN, ID_KRITERIA)
);

/*==============================================================*/
/* Table: MASTER_BAGIAN                                         */
/*==============================================================*/
create table MASTER_BAGIAN
(
   ID_BAGIAN            int not null AUTO_INCREMENT comment '',
   NAMA_BAGIAN          varchar(50) not null  comment '',
   primary key (ID_BAGIAN)
);

/*==============================================================*/
/* Table: MASTER_CALON_KARYAWAN                                 */
/*==============================================================*/
create table MASTER_CALON_KARYAWAN
(
   ID_CALON             int not null AUTO_INCREMENT comment '',
   NAMA_CALON           varchar(255) not null  comment '',
   EMAIL                varchar(50) not null  comment '',
   PASSWORD             varchar(15) not null  comment '',
   FILE_NIK             varchar(255) not null  comment '',
   JENIS_KEL            int not null  comment '',
   TEM_LAHIR            varchar(255) not null  comment '',
   TGL_LAHIR            date not null  comment '',
   JENJANG_PEND         varchar(50) not null  comment '',
   NAMA_SEK             varchar(255) not null  comment '',
   FAKULTAS             varchar(50)  comment '',
   JURUSAN_STUDI        varchar(100)  comment '',
   IPK                  numeric(5,2)  comment '',
   THN_LULUS            int not null  comment '',
   STAT_MBR             varchar(1) not null  comment '',
   STAT_KELENGKAPAN     varchar(7) not null  comment '',
   primary key (ID_CALON)
);

/*==============================================================*/
/* Table: MASTER_KARYAWAN                                       */
/*==============================================================*/
create table MASTER_KARYAWAN
(
   ID_KARYAWAN          int not null AUTO_INCREMENT comment '',
   ID_BAGIAN            int not null  comment '',
   NAMA_KARYAWAN        varchar(255) not null  comment '',
   USERNAME             varchar(15) not null  comment '',
   PASSWORD             varchar(15) not null  comment '',
   primary key (ID_KARYAWAN)
);

/*==============================================================*/
/* Table: MASTER_KRITERIA                                       */
/*==============================================================*/
create table MASTER_KRITERIA
(
   ID_KRITERIA          int not null AUTO_INCREMENT comment '',
   NAMA_KRITERIA        varchar(100) not null  comment '',
   KETERANGAN_KRITERIA  varchar(255)  comment '',
   primary key (ID_KRITERIA)
);

/*==============================================================*/
/* Table: MASTER_REKRUTMEN                                      */
/*==============================================================*/
create table MASTER_REKRUTMEN
(
   ID_REKRUTMEN         int not null AUTO_INCREMENT comment '',
   ID_BAGIAN            int not null  comment '',
   ID_KARYAWAN          int  comment '',
   OPERATOR	      		int not null  comment '',
   TGL_MULAI            date not null  comment '',
   TGL_SELESAI          date not null  comment '',
   TGL_TES              date not null  comment '',
   STAT_REKRUTMEN		varchar(1) not null  comment '',
   primary key (ID_REKRUTMEN)
);

/*==============================================================*/
/* Table: NILAI_CALON_KARYAWAN                                  */
/*==============================================================*/
create table NILAI_CALON_KARYAWAN
(
   ID_AKTIVITAS         int not null  comment '',
   ID_KRITERIA          int not null  comment '',
   NILAI                numeric(5,2) not null  comment '',
   primary key (ID_AKTIVITAS, ID_KRITERIA)
);

alter table AKTIVITAS_REKRUTMEN add constraint FK_AKTIVITA_DAFTAR_AK_MASTER_R foreign key (ID_REKRUTMEN)
      references MASTER_REKRUTMEN (ID_REKRUTMEN) on delete restrict on update restrict;

alter table AKTIVITAS_REKRUTMEN add constraint FK_AKTIVITA_MENDAFTAR_MASTER_C foreign key (ID_CALON)
      references MASTER_CALON_KARYAWAN (ID_CALON) on delete restrict on update restrict;

alter table BOBOT_KRITERIA add constraint FK_BOBOT_KR_DETAIL_KR_MASTER_K foreign key (ID_KRITERIA)
      references MASTER_KRITERIA (ID_KRITERIA) on delete restrict on update restrict;

alter table BOBOT_KRITERIA add constraint FK_BOBOT_KR_MEMILIKI__MASTER_R foreign key (ID_REKRUTMEN)
      references MASTER_REKRUTMEN (ID_REKRUTMEN) on delete restrict on update restrict;

alter table MASTER_KARYAWAN add constraint FK_MASTER_K_MENJABAT_MASTER_B foreign key (ID_BAGIAN)
      references MASTER_BAGIAN (ID_BAGIAN) on delete restrict on update restrict;

alter table MASTER_REKRUTMEN add constraint FK_MASTER_R_MENGADAKA_MASTER_B foreign key (ID_BAGIAN)
      references MASTER_BAGIAN (ID_BAGIAN) on delete restrict on update restrict;

alter table MASTER_REKRUTMEN add constraint FK_MASTER_R_OPERATOR_MASTER_K foreign key (ID_KARYAWAN)
      references MASTER_KARYAWAN (ID_KARYAWAN) on delete restrict on update restrict;

alter table MASTER_REKRUTMEN add constraint FK_MASTER_R_PERMOHON_MASTER_K foreign key (OPERATOR)
      references MASTER_KARYAWAN (ID_KARYAWAN) on delete restrict on update restrict;

alter table NILAI_CALON_KARYAWAN add constraint FK_NILAI_CA_MEMILIKI__AKTIVITA foreign key (ID_AKTIVITAS)
      references AKTIVITAS_REKRUTMEN (ID_AKTIVITAS) on delete restrict on update restrict;

alter table NILAI_CALON_KARYAWAN add constraint FK_NILAI_CA_NAMA_KRIT_MASTER_K foreign key (ID_KRITERIA)
      references MASTER_KRITERIA (ID_KRITERIA) on delete restrict on update restrict;

