insert into master_bagian(NAMA_BAGIAN) values
('Rekrutmen'),
('Layanan Pemerintah Berbasis '),
('Keamanan dan Infrastruktur Layanan TI'),
('Informasi dan Komunikasi Publik');

insert into master_karyawan(ID_BAGIAN, NAMA_KARYAWAN, USERNAME, PASSWORD) values
(1, 'Rizky', 'riz', 'riz123'),
(2, 'Daniel', 'dan', 'dan123'),
(3, 'Hermawan', 'her', 'her123'),
(4, 'Toni', 'ton', 'ton123');

insert into master_kriteria(NAMA_KRITERIA, KETERANGAN_KRITERIA) values
('Psikotes','Tes psikotes idk man'),
('Wawancara', 'Wawancara dengan pelamar'),
('Teori', 'Teori seputar bagian'),
('Praktek', 'Membuktikan langsung keahlian');