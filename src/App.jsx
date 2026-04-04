import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Delete, Trophy, RefreshCw, XCircle, Info, X, ChevronRight, ChevronLeft, Maximize, Minimize } from 'lucide-react';

// --- KAMUS KATA ---
const DICTIONARY = [
  "ABADI", "ABANG", "ABJAD", "ABSEN", "ACARA", "ACUNG", "AGAMA", "AGUNG", "AJAIB", "AJANG", "AKBAR", "AKHIR", "AKRAB", "AKSEN", "AKSES", "AKTIF", "AKTOR", "ALAMI", "ALBUM", "ALIAS", "ALIBI", "ALLAH", "ALTAR", "AMBIL", "AMPUN", "ANCAM", "ANDAI", "ANDIL", "ANEKA", "ANGAN", "ANGIN", "ANGKA", "ANGSA", "ANTAR", "ANTIK", "ANTRE", "ANYAM", "ANYIR", "AORTA", "APRIL", "APUNG", "ARANG", "ARBEI", "ARENA", "ARGON", "ARIES", "AROMA", "ARSIP", "ARSIR", "ARTIK", "ARTIS", "ARUNG", "ARWAH", "ASASI", "ASBAK", "ASBES", "ASING", "ASPAL", "ASPEK", "ASYIK", "ATEIS", "ATLAS", "ATLET", "AUDIO", "AUDIT", "AURAT", "AURUM", "AVTUR", "BABAK", "BABAT", "BABON", "BACEM", "BACOK", "BACOT", "BADAI", "BADAK", "BADAN", "BADUI", "BADUT", "BAGAI", "BAGAN", "BAGUS", "BAHAK", "BAHAN", "BAHAS", "BAHWA", "BAJAJ", "BAJAK", "BAKAL", "BAKAR", "BAKAT", "BAKAU", "BAKMI", "BAKSO", "BAKTI", "BAKUL", "BALAI", "BALAP", "BALAS", "BALET", "BALIK", "BALOK", "BALON", "BALUR", "BALUT", "BAMBU", "BANDO", "BANTU", "BANYU", "BAPAK", "BARAK", "BAREL", "BAREP", "BARET", "BARIS", "BASAH", "BASAL", "BASIS", "BASMI", "BASUH", "BATAK", "BATAL", "BATAS", "BATIK", "BATIL", "BATIN", "BATOK", "BATON", "BATUK", "BAWAH", "BAWAL", "BAWEL", "BAYAM", "BAYAR", "BAZAR", "BEBAL", "BEBAN", "BEBAS", "BEBAT", "BEBEK", "BEBER", "BECAK", "BECEK", "BECUS", "BEDAH", "BEDAK", "BEDIL", "BEGAH", "BEGAL", "BEJAT", "BEKAL", "BEKAM", "BEKAP", "BEKAS", "BEKER", "BEKUK", "BELAH", "BELAI", "BELAS", "BELEK", "BELEL", "BELIA", "BELIT", "BELOK", "BELOT", "BELUK", "BELUM", "BELUT", "BENAH", "BENAK", "BENAM", "BENAR", "BENCI", "BENDA", "BENIH", "BENUA", "BERAK", "BERAS", "BERAT", "BERES", "BERET", "BERUK", "BESAN", "BESAR", "BESEK", "BESER", "BESET", "BESOK", "BESUK", "BESUT", "BETAH", "BETIS", "BETON", "BETOT", "BETUL", "BIANG", "BIARA", "BIASA", "BIAYA", "BIBEL", "BIBIR", "BIBIT", "BIDAH", "BIDAK", "BIDAN", "BIDET", "BIDIK", "BIDUK", "BIDUR", "BIHUN", "BIJAK", "BIJIH", "BIKIN", "BIKSU", "BILAH", "BILAS", "BILIK", "BILUR", "BINAL", "BINAR", "BINER", "BINTI", "BIOLA", "BIOTA", "BISIK", "BISON", "BISUL", "BLONG", "BOBOL", "BOBOT", "BOCAH", "BOCOR", "BODOH", "BOGEM", "BOKEK", "BOKOR", "BOLAK", "BOLEH", "BOLOS", "BOLOT", "BONUS", "BOROS", "BOSAN", "BOTAK", "BOTOL", "BRUTO", "BUANA", "BUANG", "BUAYA", "BUBAR", "BUBUH", "BUBUK", "BUBUR", "BUBUT", "BUDAK", "BUFET", "BUGAR", "BUGIL", "BUJUK", "BUJUR", "BUKAN", "BUKET", "BUKIT", "BUKTI", "BULAN", "BULAT", "BULIR", "BUMBU", "BUNDA", "BUNGA", "BUNTU", "BUNUH", "BUNYI", "BURAI", "BURAM", "BURAS", "BURON", "BURSA", "BURUH", "BURUK", "BUSET", "BUSUK", "BUSUR", "BUTIK", "BUTIR", "BUTUH", "BUTUT", "BUYAR", "BUYUT", "CABAI", "CABIK", "CABUT", "CACAH", "CACAR", "CACAT", "CADAR", "CADAS", "CADEL", "CAGAR", "CAKAP", "CAKAR", "CAKEP", "CAKRA", "CAKUP", "CALON", "CAMAR", "CAMAT", "CANDA", "CANDI", "CANDU", "CAPAI", "CAPEK", "CAPIT", "CATAT", "CATUR", "CATUT", "CAWAN", "CEBAN", "CEBOL", "CEGAH", "CEGAT", "CEKAL", "CEKAM", "CEKAT", "CEKER", "CEKIK", "CEKOK", "CELAH", "CELAK", "CELUP", "CEMAR", "CEMAS", "CEPAT", "CEPEK", "CEPER", "CEPOL", "CERAH", "CERAI", "CERAK", "CERCA", "CERIA", "CERNA", "CETAK", "CETUS", "CEWEK", "CIBIR", "CICIL", "CICIP", "CICIT", "CIDUK", "CIKAL", "CILIK", "CILOK", "CINTA", "CIPTA", "CITRA", "COBEK", "COCOK", "COCOL", "COLEK", "COLOK", "COMEL", "COMOT", "COPET", "COPOT", "CORAK", "CORET", "COWOK", "CUACA", "CUBIT", "CUCUR", "CUKAI", "CUKUP", "CUKUR", "CULAS", "CULIK", "CURAH", "CURAM", "DADAK", "DADAR", "DAHAK", "DAHAN", "DAJAL", "DAKSA", "DAKWA", "DALAM", "DALIH", "DALIL", "DAMAI", "DAMAR", "DAMBA", "DANAU", "DANSA", "DAPAT", "DAPUR", "DARAH", "DARAT", "DASAR", "DATAR", "DATUK", "DATUM", "DAWAI", "DAWET", "DEBAR", "DEBAT", "DEBIT", "DEBUR", "DEBUS", "DEBUT", "DEGUP", "DEKAN", "DEKAP", "DEKAT", "DEKIL", "DEKOR", "DELIK", "DELTA", "DEMAM", "DENAH", "DENDA", "DEPAN", "DEPOT", "DERAI", "DERAP", "DERAS", "DERAU", "DEREK", "DERET", "DERIK", "DESAK", "DESAU", "DESIR", "DESIS", "DETAK", "DETIK", "DEWAN", "DIARE", "DIDIH", "DIDIK", "DIGIT", "DIKSI", "DIKTE", "DINAR", "DINAS", "DIPAN", "DISKO", "DOANG", "DOBEL", "DODOL", "DOGMA", "DOLAR", "DOMBA", "DONAT", "DONOR", "DOSEN", "DOSIS", "DOYAN", "DRAMA", "DUAFA", "DUDUK", "DUHAI", "DUKUN", "DUNIA", "DUSTA", "DUSUN", "ECENG", "EDISI", "EGOIS", "ELANG", "ELEGI", "ELING", "ELIPS", "EMAIL", "EMBER", "EMBUN", "EMISI", "EMOSI", "EMPAL", "EMPAT", "EMPUK", "ENCER", "ENCOK", "ENDAP", "ENTAH", "ENTRI", "ENYAH", "ENZIM", "EROSI", "ETIKA", "ETNIK", "ETNIS", "EYANG", "FABEL", "FAJAR", "FAKIR", "FAKTA", "FASIH", "FATAL", "FATWA", "FAUNA", "FESES", "FETUS", "FIKSI", "FINAL", "FISIK", "FLORA", "FOBIA", "FOKUS", "FOLIO", "FORUM", "FOSIL", "FOTON", "FRASA", "FRASE", "FREON", "FUNGI", "FUTUR", "GABAH", "GABUS", "GADAI", "GADIS", "GADUH", "GAGAH", "GAGAK", "GAGAL", "GAJAH", "GALAH", "GALAK", "GALAT", "GALAU", "GALON", "GAMIS", "GAMMA", "GANAS", "GANDA", "GANTI", "GAPAI", "GARAM", "GARAP", "GARDA", "GARDU", "GARIS", "GARPU", "GARUK", "GARUT", "GASAL", "GATAL", "GAUNG", "GAWAI", "GAWAT", "GELAP", "GELAR", "GELAS", "GEMAR", "GEMAS", "GEMPA", "GEMUK", "GENAP", "GENRE", "GERAK", "GERAM", "GESEK", "GESER", "GETAH", "GIGIH", "GIGIT", "GILIR", "GINCU", "GITAR", "GLOBE", "GOCAP", "GOLOK", "GOPEK", "GORES", "GOSIP", "GOSOK", "GOYAH", "GRAHA", "GRIYA", "GROGI", "GUBUK", "GUDEG", "GUGAT", "GUGUR", "GUGUS", "GULAI", "GULAT", "GULMA", "GUMAM", "GUNDU", "GURAU", "GURIH", "GURUH", "GURUN", "GUSUR", "GUYUR", "HABIB", "HABIS", "HADAP", "HADIR", "HAJAR", "HAJAT", "HAKIM", "HALAL", "HALMA", "HALTE", "HALUS", "HAMBA", "HAMPA", "HANTU", "HANYA", "HAPUS", "HARAM", "HARAP", "HARGA", "HARPA", "HARTA", "HARUM", "HARUS", "HASIL", "HASTA", "HASUT", "HAYATI", "HEBAT", "HEBOH", "HELAI", "HEMAT", "HENTI", "HERAN", "HERTZ", "HEWAN", "HIBAH", "HIBUR", "HIDUP", "HIJAB", "HIJAU", "HIMNE", "HINDU", "HIRAU", "HIRUP", "HITAM", "HONOR", "HOROR", "HOTEL", "HUJAN", "HUJAT", "HUKUM", "HUMOR", "HUMUS", "HUNUS", "HURUF", "HUTAN", "IALAH", "IBLIS", "IBRIT", "IDEAL", "IDOLA", "IKLAN", "IKLIM", "IKRAR", "ILAHI", "ILUSI", "IMAJI", "IMBAL", "IMBAS", "IMBAU", "IMBUH", "IMLEK", "IMPAS", "IMPOR", "INANG", "INCAR", "INDAH", "INDRA", "INDUK", "INFAK", "INFUS", "INGAT", "INGIN", "INJAK", "INJIL", "INSAF", "INSAN", "INTAI", "INTAN", "INTEL", "INTIP", "IRAMA", "IRING", "IRONI", "ISENG", "ISLAM", "ISTRI", "JABAT", "JAGAT", "JAHAT", "JAHIL", "JAHIT", "JAJAH", "JAJAN", "JAKET", "JAKSA", "JAKUN", "JALAK", "JALAN", "JALIN", "JALUR", "JAMAK", "JAMAN", "JAMBU", "JAMIN", "JAMUR", "JANIN", "JANJI", "JANUR", "JARAK", "JARUM", "JASAD", "JATAH", "JATUH", "JAWAB", "JEBAK", "JEBOL", "JEJAK", "JELAS", "JELEK", "JEMUR", "JENIS", "JENUH", "JEPIT", "JERUK", "JIDAT", "JIJIK", "JILAT", "JILID", "JIMAT", "JINAK", "JIRAN", "JODOH", "JOGET", "JOMPO", "JOROK", "JOULE", "JRENG", "JUANG", "JUARA", "JUBAH", "JUDES", "JUDUL", "JUJUR", "JUMAT", "JUMBO", "JUMPA", "JURUS", "KABAR", "KABEL", "KABIN", "KABUL", "KABUR", "KABUT", "KACAU", "KADAL", "KADAR", "KADER", "KAFAN", "KAGET", "KAGUM", "KAKAK", "KAKAO", "KAKAP", "KAKEK", "KALAH", "KALAP", "KALAU", "KALBU", "KALDU", "KALEM", "KALOR", "KALUT", "KAMAR", "KAMIS", "KAMUS", "KANAL", "KANAN", "KANJI", "KAPAK", "KAPAL", "KAPAN", "KAPAS", "KAPOK", "KAPUK", "KAPUR", "KARAM", "KARAT", "KARET", "KARGO", "KARIB", "KARMA", "KARTU", "KARYA", "KASAR", "KASET", "KASIH", "KASIR", "KASTA", "KASTI", "KASUR", "KASUS", "KATAK", "KATUN", "KATUP", "KAWAH", "KAWAL", "KAWAN", "KAWAT", "KAYAK", "KAYUH", "KEBAB", "KEBAL", "KEBAS", "KEBUN", "KEBUT", "KECAM", "KECAP", "KECIL", "KECUT", "KEDAI", "KEDAP", "KEDIP", "KEDIP", "KEDOK", "KEJAM", "KEJAR", "KEJUT", "KEKAL", "KEKAR", "KELAK", "KELAM", "KELAS", "KELOR", "KEMAH", "KEMAS", "KENAL", "KENDI", "KEONG", "KEPAK", "KEPAL", "KEPIK", "KERAH", "KERAK", "KERAM", "KERAN", "KERAP", "KERAS", "KERAT", "KEREN", "KERIS", "KERJA", "KERUH", "KERUT", "KESAL", "KESAN", "KESET", "KETAN", "KETAT", "KETIK", "KETUA", "KETUK", "KIBAR", "KIBAS", "KICAU", "KIDAL", "KIKIL", "KIKIR", "KIKIS", "KIKUK", "KILAU", "KIMIA", "KIPAS", "KIPER", "KIRIM", "KISAH", "KITAB", "KLAIM", "KLIEN", "KLISE", "KOALA", "KOBOI", "KOBRA", "KOCAK", "KODOK", "KOLAK", "KOLAM", "KOLOM", "KOLON", "KOLOT", "KOMET", "KOMIK", "KONDE", "KONON", "KOPER", "KOPLO", "KORAN", "KOTAK", "KOTOR", "KRIYA", "KUACI", "KUALI", "KUASA", "KUBAH", "KUBIK", "KUBUR", "KUBUS", "KUKUS", "KULIT", "KULOT", "KUMAL", "KUMAN", "KUMAT", "KUMIS", "KUMUH", "KUMUR", "KUNCI", "KUOTA", "KUPAS", "KUPON", "KURAS", "KURIR", "KURMA", "KURSI", "KURUN", "KURUS", "KURVA", "KUSAM", "KUSEN", "KUSIR", "KUSUT", "KUTIP", "KUTUB", "KUTUK", "LABEL", "LABIL", "LACAK", "LAHAP", "LAHAR", "LAHIR", "LAJUR", "LALAI", "LALAP", "LALAT", "LAMAR", "LAMPU", "LAPAK", "LAPAR", "LAPOR", "LAPUK", "LARIS", "LARON", "LARUT", "LARVA", "LASER", "LATAH", "LATAR", "LATEN", "LATIH", "LAWAN", "LAYAK", "LAYAN", "LAYAR", "LAZIM", "LEBAH", "LEBAM", "LEBAR", "LEBAT", "LEBIH", "LEBUR", "LEDAK", "LEDEK", "LEGAL", "LEGAM", "LEHER", "LEKAS", "LEKAT", "LEKUK", "LELAH", "LELAP", "LELEH", "LELET", "LEMAH", "LEMAK", "LEMAS", "LEMBU", "LEMON", "LEMUR", "LENSA", "LEPAS", "LEPEK", "LETAK", "LETIH", "LEVEL", "LEWAT", "LEZAT", "LIANG", "LIBAT", "LIBRA", "LIBUR", "LICIK", "LICIN", "LIDAH", "LIHAI", "LIHAT", "LILIN", "LILIT", "LIMAS", "LIMAU", "LIMIT", "LIMUN", "LIPID", "LIPIT", "LIPUT", "LIRIH", "LIRIK", "LISAN", "LITER", "LIVER", "LOBAK", "LOGAM", "LOGAT", "LOGIS", "LOKAL", "LOKET", "LOLOS", "LOYAL", "LUANG", "LUDAH", "LUDES", "LUGAS", "LUKIS", "LULUH", "LULUR", "LULUS", "LUMUT", "LUNAK", "LUNAS", "LURAH", "LURUS", "LUSIN", "LUSUH", "LUTUT", "LUWES", "MABUK", "MACAM", "MACAN", "MACET", "MADYA", "MAFIA", "MAGIS", "MAGMA", "MAHAL", "MAHAR", "MAHIR", "MAJAS", "MAKAM", "MAKAN", "MAKET", "MAKIN", "MAKNA", "MAKRO", "MALAH", "MALAM", "MALAS", "MAMPU", "MANDI", "MANIA", "MANIS", "MANJA", "MAPAN", "MARAH", "MARGA", "MARKA", "MASAK", "MASIF", "MASIH", "MASSA", "MASUK", "MATOA", "MAWAR", "MAWAS", "MAYAT", "MEBEL", "MEDAN", "MEDIA", "MEDIK", "MEDIS", "MEGAH", "MEKAR", "MELAR", "MELAS", "MELEK", "MELON", "MEMAR", "MENIT", "MENOR", "MERAH", "MERAK", "MERDU", "MEREK", "MEREM", "MESIN", "MESIU", "MESKI", "MESRA", "MESTI", "METAL", "METER", "METRO", "MEWAH", "MIKRO", "MILIK", "MIMPI", "MINAT", "MINOR", "MINTA", "MINUM", "MINUS", "MIRIP", "MIRIS", "MISAL", "MITOS", "MITRA", "MOBIL", "MOCHI", "MODAL", "MODEL", "MODEM", "MODIS", "MODUL", "MODUS", "MOGOK", "MOHON", "MOLAR", "MOMEN", "MORAL", "MORSE", "MOTEL", "MOTIF", "MOTOR", "MUARA", "MUDAH", "MUDIK", "MUJUR", "MUKIM", "MULAI", "MULAS", "MULIA", "MULUS", "MULUT", "MURAH", "MURAI", "MURAL", "MURAM", "MURID", "MURKA", "MURNI", "MUSIK", "MUSIM", "MUSUH", "MUTAN", "NAJIS", "NAKAL", "NALAR", "NAMUN", "NANAR", "NANAS", "NANTI", "NAPAS", "NASIB", "NATAL", "NAUNG", "NENEK", "NETRA", "NGERI", "NGILU", "NIAGA", "NIFAS", "NIHIL", "NIKAH", "NIKEL", "NILAI", "NILON", "NIPIS", "NISAB", "NISAN", "NOMOR", "NORAK", "NORMA", "NOVEL", "NYALA", "NYALI", "NYATA", "NYAWA", "NYEPI", "NYERI", "NYIUR", "OASIS", "OBENG", "OBJEK", "OBRAL", "OBRAS", "OBROL", "OBYEK", "OKNUM", "OKTAF", "OKTET", "OLENG", "OMBAK", "OMEGA", "OMONG", "OMPOL", "ONCOM", "OPERA", "OPINI", "OPIUM", "OPLOS", "OPTIK", "ORANG", "ORASI", "ORBIT", "ORDER", "ORGAN", "OYONG", "PACAR", "PADAM", "PADAN", "PADAT", "PAGAR", "PAHAM", "PAHAT", "PAHIT", "PAJAK", "PAKAI", "PAKAN", "PAKAR", "PAKDE", "PAKEM", "PAKET", "PAKIS", "PAKSA", "PAKTA", "PALEM", "PALET", "PALSU", "PAMAN", "PAMER", "PAMIT", "PAMOR", "PANAH", "PANAI", "PANAS", "PANCA", "PANCI", "PANCO", "PANDU", "PANEL", "PANEN", "PANIK", "PANIR", "PANJI", "PANTI", "PAPAN", "PAPAR", "PARAH", "PARAS", "PARAU", "PARIT", "PARKA", "PARUH", "PARUT", "PASAK", "PASAL", "PASAR", "PASIF", "PASIR", "PASTA", "PASTI", "PATAH", "PATEN", "PATIN", "PATUH", "PATUK", "PATUT", "PAWAI", "PAYAH", "PAYAU", "PAYET", "PECAH", "PECAT", "PECEL", "PECUT", "PEDAL", "PEDAS", "PEDIH", "PEGAL", "PEGAS", "PEJAL", "PEJAM", "PEKAK", "PEKAN", "PEKAT", "PEKIK", "PELAN", "PELET", "PELIK", "PELIT", "PELUH", "PELUK", "PENAT", "PENUH", "PENYU", "PEPES", "PERAH", "PERAK", "PERAN", "PERAS", "PERCA", "PERDU", "PERGI", "PERIH", "PERLU", "PERON", "PERUT", "PESAN", "PESAT", "PESTA", "PESUT", "PETAI", "PETAK", "PETAL", "PETIK", "PETIR", "PETIS", "PEYEK", "PEYOT", "PIALA", "PIANO", "PIARA", "PIATU", "PIHAK", "PIJAK", "PIJAR", "PIJAT", "PIKAT", "PIKET", "PIKIR", "PIKUL", "PIKUN", "PILAH", "PILAR", "PILEK", "PILIH", "PILIN", "PILOT", "PILUS", "PINTA", "PINTU", "PINUS", "PIPET", "PIPIH", "PIPIL", "PIPIT", "PISAH", "PISAU", "PISIN", "PITAK", "PITAM", "PITON", "PIVOT", "PLANG", "PLANO", "PLAZA", "PLENO", "PLONG", "PLUTO", "POHON", "POJOK", "POKER", "POKOK", "POLAH", "POLES", "POLIO", "POLIP", "POLIS", "POLKA", "POLOS", "POMPA", "PONCO", "POPOK", "POROS", "PORSI", "PREMI", "PRIMA", "PROSA", "PUASA", "PUBER", "PUCAT", "PUCUK", "PUDAR", "PUDEL", "PUING", "PUISI", "PUKAT", "PUKAU", "PUKUL", "PULAS", "PULAU", "PULEN", "PULIH", "PULSA", "PULUH", "PUNAH", "PUNDI", "PUNUK", "PUNYA", "PUPIL", "PUPUK", "PUPUS", "PURBA", "PUSAR", "PUSAT", "PUSPA", "PUTAR", "PUTIH", "PUTIK", "PUTRA", "PUTRI", "PUTUS", "PUYER", "PUYUH", "QURAN", "RABUN", "RACIK", "RACUN", "RADAR", "RADIO", "RAGAM", "RAHIM", "RAJAH", "RAJAM", "RAJIN", "RAJUT", "RAKET", "RAKIT", "RAKSA", "RAKUS", "RALAT", "RAMAH", "RAMAI", "RAMAL", "RAMBU", "RAMES", "RANAH", "RANAI", "RANCU", "RANUM", "RAPAT", "RAPEL", "RAPUH", "RASIO", "RASUK", "RASUL", "RATAP", "RATUS", "RAUNG", "RAWAN", "RAWAT", "RAWIT", "RAWON", "RAYAP", "RAYON", "RAZIA", "REBAH", "REBON", "REBUK", "REBUS", "REBUT", "RECEH", "REDAM", "REDUP", "REHAT", "REKAM", "REKAT", "REKOR", "REMAH", "REMEH", "REMUK", "RENDA", "RENTA", "REPOT", "RESAH", "RESEP", "RESIK", "RESIN", "RESMI", "RESTU", "RETAK", "RETAS", "RETRO", "RETUR", "REUNI", "REWEL", "REZIM", "RIANG", "RIBUT", "RICUH", "RILIS", "RIMBA", "RINAI", "RINDU", "RISAU", "RISET", "RITEL", "RIVAL", "ROBEK", "ROBOH", "ROBOT", "ROKET", "ROKOK", "ROMPI", "RONDA", "RONDE", "ROTAN", "ROYAL", "RUANG", "RUBAH", "RUJAK", "RUJUK", "RUKUN", "RUMAH", "RUMIT", "RUMOR", "RUMPI", "RUMUS", "RUNGU", "RUNUT", "RUSAK", "RUSUH", "RUSUK", "RUTIN", "SABAR", "SABDA", "SABET", "SABIT", "SABTU", "SABUK", "SABUN", "SABUT", "SADAP", "SADAR", "SADIS", "SAHAM", "SAHUR", "SAING", "SAINS", "SAJAK", "SAJEN", "SAKIT", "SAKSI", "SAKTI", "SALAH", "SALAM", "SALAR", "SALDO", "SALEM", "SALEP", "SALIN", "SALJU", "SALON", "SALTO", "SALUR", "SALUT", "SAMAR", "SAMPO", "SANCA", "SANDI", "SARAF", "SARAN", "SARAT", "SASAR", "SATIN", "SATIR", "SATWA", "SAUNA", "SAUNG", "SAWAH", "SAYAP", "SAYAT", "SAYUP", "SAYUR", "SEBAB", "SEBAL", "SEBUT", "SEDAN", "SEDAP", "SEDIA", "SEDIH", "SEDUH", "SEGAN", "SEGAR", "SEGEL", "SEHAT", "SEJAK", "SEJUK", "SEKAP", "SEKAT", "SEKON", "SEKOP", "SEKTE", "SELAI", "SELAM", "SELAT", "SELOP", "SEMAK", "SEMIR", "SEMUA", "SEMUR", "SEMUT", "SENAM", "SENAR", "SENAT", "SENDI", "SENDU", "SENIN", "SENJA", "SEPAK", "SEPAL", "SEPUH", "SERAH", "SERAK", "SERAM", "SERAP", "SERAT", "SERBA", "SERBU", "SEREH", "SEREP", "SERET", "SERTA", "SERUM", "SERUT", "SESAK", "SESAT", "SETAN", "SETIA", "SETIR", "SETOR", "SEWOT", "SIAGA", "SIANG", "SIAPA", "SIBUK", "SIDIK", "SIFAT", "SIGAP", "SIGMA", "SIHIR", "SIKAP", "SIKAT", "SIKSA", "SIKUT", "SILAM", "SILAT", "SILAU", "SILET", "SIMAK", "SINAR", "SINGA", "SINIS", "SIPIL", "SIPIR", "SIPIT", "SIPUT", "SIRAM", "SIRIH", "SIRIK", "SIRIP", "SIRNA", "SIRUP", "SISIK", "SISIR", "SISWA", "SISWI", "SITUS", "SIUNG", "SKALA", "SKEMA", "SKRIP", "SOBAT", "SOBEK", "SOGOK", "SOLAR", "SOLEK", "SOLID", "SONAR", "SONIK", "SOPAN", "SOPIR", "SORAK", "SOROT", "SOSOK", "SPASI", "SPION", "SPONS", "SPORA", "STRES", "STUDI", "SUAKA", "SUAMI", "SUARA", "SUATU", "SUBUH", "SUBUR", "SUDAH", "SUDUT", "SUJUD", "SUKMA", "SUKUN", "SULAM", "SULAP", "SULIT", "SUMBU", "SUMUR", "SUNAH", "SUNYI", "SUPER", "SURAM", "SURAT", "SURGA", "SURUT", "SURYA", "SUSAH", "SUSUN", "SUTRA", "SUWIR", "SYAIR", "TABAH", "TABEL", "TABIR", "TABUR", "TAGIH", "TAHAN", "TAHAP", "TAHUN", "TAJAM", "TAKAR", "TAKSI", "TAKUT", "TAKWA", "TALAS", "TAMAK", "TAMAN", "TAMAT", "TANAH", "TANAM", "TANDA", "TANDU", "TANPA", "TANTE", "TANYA", "TAPIR", "TARAF", "TARIF", "TARIK", "TARUH", "TATAP", "TAWAN", "TAWAR", "TAWAS", "TAWON", "TEBAK", "TEBAL", "TEBAR", "TEBUS", "TEDUH", "TEGAK", "TEGAL", "TEGAR", "TEGAS", "TEGUH", "TEGUK", "TEGUR", "TEKAD", "TEKAN", "TEKUN", "TELAH", "TELAN", "TELAT", "TELER", "TELUK", "TELUR", "TEMAN", "TEMPE", "TEMPO", "TENAR", "TENDA", "TENOR", "TENSI", "TENTU", "TENUN", "TEORI", "TEPAT", "TEPUK", "TERAS", "TERIK", "TERKA", "TEROR", "TERUS", "TESIS", "TETAP", "TETES", "THETA", "TIADA", "TIANG", "TIARA", "TIDAK", "TIDUR", "TIKAR", "TIKET", "TIKUS", "TIMAH", "TIMBA", "TIMUN", "TIMUR", "TINJA", "TINJU", "TINTA", "TIPIS", "TIRAI", "TIRAM", "TIRIS", "TIRTA", "TIRUS", "TITIK", "TITIP", "TOBAT", "TOKEK", "TOKOH", "TOLAK", "TOMAT", "TOPAN", "TOPIK", "TORSI", "TORSO", "TORUS", "TOTAL", "TRANS", "TROLI", "TUANG", "TUBUH", "TUDUH", "TUGAS", "TUHAN", "TUJUH", "TUKAR", "TULAR", "TULEN", "TULIS", "TULUS", "TUMIS", "TUMIT", "TUMOR", "TUMPU", "TUNAI", "TUNAS", "TUNDA", "TUNIK", "TUPAI", "TURIS", "TURUN", "TURUS", "TURUT", "TUSUK", "TUTOR", "TUTUP", "TUTUR", "TUYUL", "UDANG", "UDARA", "UJUNG", "ULAMA", "ULANG", "ULTRA", "ULUNG", "UMPAN", "UMPAT", "UNDUH", "UNDUR", "UNGSI", "UNSUR", "UNTUK", "UPAYA", "UPETI", "USAHA", "USANG", "USTAD", "USUNG", "UTAMA", "UTANG", "UTARA", "VAKUM", "VALID", "VENUS", "VERSI", "VIDEO", "VIRGO", "VIRUS", "VITAL", "VOKAL", "VONIS", "WABAH", "WADAH", "WADUK", "WAHAI", "WAHYU", "WAJAH", "WAJAN", "WAJAR", "WAJIB", "WAJIK", "WAKAF", "WAKIL", "WAKTU", "WALAU", "WALET", "WANGI", "WARAS", "WARGA", "WARIS", "WARNA", "WARTA", "WASIT", "WATAK", "WESEL", "WIJEN", "WINDU", "WISMA", "WUJUD", "YAITU", "YAKIN", "YAKNI", "YATIM", "ZAKAT", "ZAMAN", "ZEBRA", "ZIGOT", "ZIKIR", "ZIRAH", "ZUHUR"
];

// --- FUNGSI LOCAL STORAGE ---
const STORAGE_KEY = 'crosswordle_id_played';

const getPlayedWords = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } 
  catch { return []; }
};

const addPlayedWord = (word) => {
  const played = getPlayedWords();
  if (!played.includes(word)) {
    played.push(word);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(played));
  }
};

const resetPlayedWords = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

// --- ALGORITMA PUZZLE & WARNA ---
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function calculateWordleColors(guess, targetWord) {
  let colors = Array(5).fill('absent');
  let targetChars = targetWord.split('');
  let guessChars = guess.split('');

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      colors[i] = 'correct';
      targetChars[i] = null;
      guessChars[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] && targetChars.includes(guessChars[i])) {
      colors[i] = 'present';
      targetChars[targetChars.indexOf(guessChars[i])] = null;
    }
  }
  return colors;
}

// Fungsi Pusat Pengecekan Hard Mode
function checkHardModeValidity(word, prevWords, prevColorsArray) {
    const r = prevWords.length;
    if (r === 0) return { valid: true };

    const prevWord = prevWords[r - 1];
    const prevColors = prevColorsArray[r - 1];

    const requiredLetters = [];
    for (let c = 0; c < 5; c++) {
        if (prevColors[c] === 'present' || prevColors[c] === 'correct') {
            requiredLetters.push(prevWord[c]);
        }
    }
    let tempWord = word;
    for (const reqL of requiredLetters) {
        if (tempWord.includes(reqL)) {
            tempWord = tempWord.replace(reqL, '');
        } else {
            return { valid: false, error: `Baris ini harus menggunakan huruf '${reqL}' dari petunjuk di atas.` };
        }
    }

    const wordChars = word.split('');
    for (let prevR = 0; prevR < r; prevR++) {
        const pWord = prevWords[prevR];
        const pCols = prevColorsArray[prevR];

        const requiredCount = {};
        for (let c = 0; c < 5; c++) {
            if (pCols[c] === 'correct' || pCols[c] === 'present') {
                requiredCount[pWord[c]] = (requiredCount[pWord[c]] || 0) + 1;
            }
        }

        for (let c = 0; c < 5; c++) {
            if (pCols[c] === 'absent' && pWord[c]) {
                const char = pWord[c];
                const maxAllowed = requiredCount[char] || 0;
                const countInCurrent = wordChars.filter(x => x === char).length;
                if (countInCurrent > maxAllowed) {
                    if (maxAllowed === 0) {
                        return { valid: false, error: `Huruf '${char}' sudah terbukti salah (abu-abu).`, charError: char };
                    } else {
                        return { valid: false, error: `Maksimal huruf '${char}' hanya ${maxAllowed}.`, charError: char };
                    }
                }
            }
        }
    }
    return { valid: true };
}

// Men-generate puzzle DENGAN logika kemiripan progresif
function generatePuzzleData(targetWord, rows = 3) {
    let foundPath = null;
    let foundColors = null;
    let attempts = 0;
    const path = [];
    const colors = [];

    const wordScores = {};
    for (let w of DICTIONARY) {
        const guessColors = calculateWordleColors(w, targetWord);
        const score = guessColors.reduce((acc, val) => acc + (val === 'correct' ? 2 : val === 'present' ? 1 : 0), 0);
        wordScores[w] = { score, guessColors };
    }

    const candidatesPerRow = [];
    for (let r = 0; r < rows; r++) {
        let idealScore = 0;
        if (rows === 2) idealScore = [2, 6][r];
        else if (rows === 3) idealScore = [1, 4, 7][r];
        else if (rows === 4) idealScore = [1, 3, 5, 7][r];
        else if (rows === 5) idealScore = [0, 2, 4, 6, 8][r];

        let candidates = shuffle([...DICTIONARY]);
        candidates.sort((a, b) => {
            let diffA = Math.abs(wordScores[a].score - idealScore);
            let diffB = Math.abs(wordScores[b].score - idealScore);
            return diffA - diffB;
        });
        candidatesPerRow.push(candidates);
    }

    function backtrack(r) {
        if (foundPath || attempts > 2000) return; 
        if (r === rows) {
            foundPath = [...path];
            foundColors = [...colors];
            return;
        }
        
        for (let word of candidatesPerRow[r]) {
            if (word === targetWord) continue;
            if (path.includes(word)) continue; 
            
            const { score, guessColors } = wordScores[word];
            
            if (r > 0) {
                const prevScore = wordScores[path[r-1]].score;
                if (score < prevScore) continue;

                const hmCheck = checkHardModeValidity(word, path, colors);
                if (!hmCheck.valid) continue;
            }
            
            path.push(word);
            colors.push(guessColors);
            attempts++;
            
            backtrack(r + 1);
            
            path.pop();
            colors.pop();
        }
    }
    
    backtrack(0);
    if (foundPath) return { colors: foundColors, words: foundPath };
    return null;
}

function findAlternativeWords(targetWord, colorsArray, seenPaths) {
    const rows = colorsArray.length;
    const targetColorsStr = colorsArray.map(c => c.join(','));
    const candsPerRow = [];
    
    for (let r = 0; r < rows; r++) {
        const validForColors = DICTIONARY.filter(w => {
            if (w === targetWord) return false;
            return calculateWordleColors(w, targetWord).join(',') === targetColorsStr[r];
        });
        candsPerRow.push(shuffle(validForColors));
    }

    let foundPath = null;
    let attempts = 0;
    
    function backtrack(r, currentPath) {
        if (foundPath || attempts > 3000) return;
        if (r === rows) {
            const currentPathStr = currentPath.join(',');
            if (!seenPaths.includes(currentPathStr)) {
                foundPath = [...currentPath];
            }
            return;
        }

        for (const word of candsPerRow[r]) {
            attempts++;
            if (currentPath.includes(word)) continue; 
            
            if (r > 0) {
                const hmCheck = checkHardModeValidity(word, currentPath, colorsArray.slice(0, r));
                if (!hmCheck.valid) continue;
            }
            currentPath.push(word);
            backtrack(r + 1, currentPath);
            currentPath.pop();
        }
    }

    backtrack(0, []);
    return foundPath;
}

function getValidLevel(isHardMode = false) {
   let played = getPlayedWords();
   let available = DICTIONARY.filter(w => !played.includes(w));
   
   if (available.length === 0) {
      resetPlayedWords(); 
      available = [...DICTIONARY];
      played = [];
   }

   let shuffledAvailable = shuffle([...available]);
   let targetRows = isHardMode ? 5 : 3;

   for (let target of shuffledAvailable) {
      for(let i=0; i < (isHardMode ? 15 : 5); i++) {
         let data = generatePuzzleData(target, targetRows);
         if (data) return { target, colors: data.colors, words: data.words, rows: targetRows, seenPaths: [data.words.join(',')] };
      }
   }
   
   let fallbackRows = isHardMode ? 4 : 2;
   for (let target of shuffledAvailable) {
      let data = generatePuzzleData(target, fallbackRows);
      if (data) return { target, colors: data.colors, words: data.words, rows: fallbackRows, seenPaths: [data.words.join(',')] };
   }

   return { target: shuffledAvailable[0], colors: [], words: [], rows: 0, seenPaths: [] };
}


// --- KOMPONEN KOTAK (TILE) - 2026 SPATIAL UPGRADE ---
const Tile = ({ letter, status, hasError, isActive, onClick, onShowError, size = 'normal' }) => {
  const statusClasses = {
    empty: "bg-white/[0.03] ring-1 ring-inset ring-white/10 text-white shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)]",
    correct: "bg-gradient-to-br from-emerald-400 to-emerald-600 ring-1 ring-inset ring-white/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    present: "bg-gradient-to-br from-amber-400 to-amber-600 ring-1 ring-inset ring-white/30 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    absent: "bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-inset ring-white/10 text-white/90",
  };

  const sizeClasses = {
    small: "w-8 h-8 md:w-10 md:h-10 text-lg md:text-xl rounded-xl",
    normal: "w-full aspect-square text-2xl sm:text-3xl md:text-4xl rounded-2xl"
  };

  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-center font-bold uppercase transition-all duration-300 relative cursor-pointer
        ${sizeClasses[size]}
        ${statusClasses[status || 'empty']}
        ${isActive ? 'ring-4 ring-indigo-400/50 scale-105 z-10' : ''}
      `}
    >
      {letter}
      {hasError && (
        <div 
          className="absolute top-[-4px] right-[-4px] cursor-help z-20 hover:scale-125 transition-transform"
          onClick={(e) => { e.stopPropagation(); onShowError && onShowError(); }}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0H0L16 16V0Z" fill="#F43F5E" />
          </svg>
        </div>
      )}
    </div>
  );
};

// --- KOMPONEN INSTRUKSI ---
const InstructionModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Cara Bermain",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Misi kamu adalah memecahkan teka-teki kata mundur! Isi kotak kosong dari atas ke bawah agar sesuai dengan warna petunjuk, hingga berujung pada Kata Target di baris paling bawah.
          </p>
          <div className="flex flex-col gap-1.5 items-center justify-center py-2">
            <div className="flex gap-1.5"><Tile status="empty" size="small"/><Tile status="empty" size="small"/><Tile status="empty" size="small"/><Tile status="empty" size="small"/><Tile status="empty" size="small"/></div>
            <div className="flex gap-1.5"><Tile status="absent" size="small"/><Tile status="present" size="small"/><Tile status="correct" size="small"/><Tile status="present" size="small"/><Tile status="absent" size="small"/></div>
            <div className="flex gap-1.5"><Tile letter="H" status="correct" size="small"/><Tile letter="E" status="correct" size="small"/><Tile letter="L" status="correct" size="small"/><Tile letter="L" status="correct" size="small"/><Tile letter="O" status="correct" size="small"/></div>
          </div>
        </div>
      )
    },
    {
      title: "Arti Warna Kotak",
      content: (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">Petunjuk warna terhadap target akhir:</p>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <Tile status="correct" size="small" />
            <p className="text-slate-200 text-sm"><span className="text-emerald-400 font-bold">Hijau:</span> Huruf sudah benar dan posisinya tepat.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <Tile status="present" size="small" />
            <p className="text-slate-200 text-sm"><span className="text-amber-400 font-bold">Kuning:</span> Huruf ada di kata, tapi posisinya salah.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <Tile status="absent" size="small" />
            <p className="text-slate-200 text-sm"><span className="text-slate-400 font-bold">Abu-abu:</span> Huruf tidak ada di kata tersebut.</p>
          </div>
        </div>
      )
    },
    {
      title: "Kata Harus Baku",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">Tebakanmu di setiap baris <strong>harus berupa kata asli</strong> (kata baku dalam bahasa Indonesia).</p>
          <div className="space-y-3">
            <div>
              <p className="text-emerald-400 text-xs mb-1">✔ Benar (Kata Asli)</p>
              <div className="flex gap-1.5 justify-center"><Tile letter="L" status="present" size="small"/><Tile letter="E" status="correct" size="small"/><Tile letter="V" status="absent" size="small"/><Tile letter="E" status="absent" size="small"/><Tile letter="L" status="present" size="small"/></div>
            </div>
            <div>
              <p className="text-rose-400 text-xs mb-1">✖ Salah (Bukan Kata / Asal Ketik)</p>
              <div className="flex gap-1.5 justify-center"><Tile letter="Y" status="absent" hasError size="small"/><Tile letter="E" status="correct" hasError size="small"/><Tile letter="E" status="absent" hasError size="small"/><Tile letter="E" status="absent" hasError size="small"/><Tile letter="T" status="absent" hasError size="small"/></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Aturan Hard Mode",
      content: (
        <div className="space-y-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-slate-300 text-sm mb-2"><strong className="text-emerald-400">Wajib Dipakai:</strong><br/>Huruf <b>Kuning</b> dan <b>Hijau</b> dari baris atas <b>HARUS</b> kamu gunakan lagi di baris bawahnya.</p>
            <div className="flex gap-1.5 items-center justify-center"><Tile letter="E" status="present" size="small" /><div className="text-slate-400">→</div><Tile letter="E" status="correct" size="small" /></div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-slate-300 text-sm mb-2"><strong className="text-slate-400">Dilarang Dipakai:</strong><br/>Huruf <b>Abu-abu</b> artinya salah, sehingga <b>TIDAK BOLEH</b> kamu gunakan lagi di baris bawahnya.</p>
            <div className="flex gap-1.5 items-center justify-center"><Tile letter="S" status="absent" size="small" /><div className="text-slate-400">→</div><Tile letter="S" status="absent" hasError size="small" /></div>
          </div>
        </div>
      )
    },
    {
      title: "Tanda Kesalahan",
      content: (
        <div className="space-y-4 text-center">
          <p className="text-slate-300 text-sm">
            Melihat segitiga <strong className="text-rose-400">merah</strong> di pojok kotak? Itu artinya ada aturan yang dilanggar. <br/><br/><strong>Klik kotak tersebut</strong> untuk membaca alasan kesalahannya!
          </p>
          <div className="flex gap-1.5 justify-center py-2">
              <Tile letter="S" status="absent" size="small" />
              <Tile status="absent" size="small" />
              <Tile letter="V" status="present" hasError size="small" />
              <Tile status="absent" size="small" />
              <Tile status="absent" size="small" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#050505]/90 backdrop-blur-3xl ring-1 ring-inset ring-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">{steps[currentStep].title}</h2>
          <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-center min-h-[220px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {steps[currentStep].content}
        </div>

        <div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-5 bg-indigo-500' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(p => p - 1)} className="p-2 rounded-full text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronLeft size={18} />
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button onClick={() => setCurrentStep(p => p + 1)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-full shadow-[0_4px_15px_-4px_rgba(99,102,241,0.5)] flex items-center gap-1 active:scale-95 transition-all">
                Lanjut <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={onClose} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-full shadow-[0_4px_15px_-4px_rgba(16,185,129,0.5)] active:scale-95 transition-all">
                Main
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN CONFETTI (Dibungkus React.memo agar tidak me-render ulang) ---
const Confetti = React.memo(() => {
  const colors = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];
  const pieces = useMemo(() => Array.from({ length: 75 }).map((_, i) => {
    const spread = Math.random() * 500 - 250; 
    const height = -150 - Math.random() * 200; 
    const drift = spread + (Math.random() * 100 - 50); 
    
    return {
      id: i,
      tx: `${spread}px`,
      ty: `${height}px`,
      fx: `${drift}px`,
      r: `${Math.random() * 1080 - 540}deg`,
      animationDuration: `${Math.random() * 1.5 + 2}s`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      width: `${Math.random() * 6 + 5}px`,
      height: `${Math.random() * 12 + 6}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    };
  }), []);

  return (
    <div className="fixed top-1/2 left-1/2 pointer-events-none z-[100]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-[-5px] left-[-5px]" 
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.backgroundColor,
            borderRadius: p.borderRadius,
            '--tx': p.tx,
            '--ty': p.ty,
            '--fx': p.fx,
            '--r': p.r,
            animation: `confetti-burst ${p.animationDuration} forwards`
          }}
        />
      ))}
    </div>
  );
});

// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [showInstructions, setShowInstructions] = useState(() => getPlayedWords().length === 0);
  const [isHardMode, setIsHardMode] = useState(false);
  const [puzzle, setPuzzle] = useState(null); 
  const [grid, setGrid] = useState([]);
  const [errors, setErrors] = useState([]);
  const [activeCell, setActiveCell] = useState({ r: 0, c: 0 });
  const [gameState, setGameState] = useState('loading');
  const [toastMsg, setToastMsg] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: DICTIONARY.length });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const keyStatuses = useMemo(() => {
    if (!puzzle) return {};
    const statuses = {};
    
    if (puzzle.target) {
      for (const char of puzzle.target) {
        statuses[char] = 'correct';
      }
    }

    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < 5; c++) {
        const letter = grid[r][c];
        if (letter) {
          const cellColor = puzzle.colors[r][c];
          const currentStatus = statuses[letter];
          if (cellColor === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
            statuses[letter] = 'absent';
          }
        }
      }
    }
    return statuses;
  }, [grid, puzzle]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const startNextLevel = useCallback(() => {
    const newLvl = getValidLevel(isHardMode);
    setPuzzle(newLvl);
    setGrid(Array(newLvl.rows).fill('').map(() => Array(5).fill('')));
    setErrors(Array(newLvl.rows).fill('').map(() => Array(5).fill(null)));
    setActiveCell({ r: 0, c: 0 });
    setProgress({ current: getPlayedWords().length, total: DICTIONARY.length });
    setGameState('playing');
  }, [isHardMode]);

  useEffect(() => {
     startNextLevel();
  }, [startNextLevel]);

  const handleSolve = useCallback(() => {
    if (!puzzle || !puzzle.words) return;
    setGrid(puzzle.words.map(w => w.split('')));
    setErrors(Array(puzzle.rows).fill('').map(() => Array(5).fill(null)));
  }, [puzzle]);

  const handleAlternative = useCallback(() => {
    if (!puzzle) return;
    const newWords = findAlternativeWords(puzzle.target, puzzle.colors, puzzle.seenPaths);
    
    if (newWords) {
        setPuzzle(prev => ({ 
            ...prev, 
            words: newWords,
            seenPaths: [...prev.seenPaths, newWords.join(',')]
        }));
        setGrid(newWords.map(w => w.split('')));
        setErrors(Array(puzzle.rows).fill('').map(() => Array(5).fill(null)));
    } else {
        showToast("Tidak ada alternatif kombinasi logis lainnya untuk pola warna ini di dalam kamus.");
    }
  }, [puzzle]);

  const validateGrid = useCallback(() => {
    if (!puzzle) return;

    let newErrors = Array(puzzle.rows).fill(null).map(() => Array(5).fill(null));
    let isWin = true;
    let anyEmpty = false;
    const currentWords = [];

    for (let r = 0; r < puzzle.rows; r++) {
      const rowChars = grid[r];
      const isRowFull = rowChars.every(c => c !== '');
      const word = rowChars.join('');
      
      if (!isRowFull) {
        anyEmpty = true;
        isWin = false;
      }

      for (let c = 0; c < 5; c++) {
        if (rowChars[c] !== '' && puzzle.colors[r][c] === 'correct' && rowChars[c] !== puzzle.target[c]) {
          newErrors[r][c] = `Harus huruf '${puzzle.target[c]}' karena kotak ini hijau.`;
          isWin = false;
        }
      }

      if (isRowFull) {
        if (!DICTIONARY.includes(word)) {
          newErrors[r].fill("Bukan kata dalam kamus bahasa Indonesia.");
          isWin = false;
          continue; 
        }

        const calcColors = calculateWordleColors(word, puzzle.target);
        for (let c = 0; c < 5; c++) {
          if (calcColors[c] !== puzzle.colors[r][c]) {
            if (!newErrors[r][c]) newErrors[r][c] = "Tebakan ini menghasilkan kalkulasi warna yang salah.";
            isWin = false;
          }
        }

        if (r > 0) {
          const hmCheck = checkHardModeValidity(word, currentWords, puzzle.colors.slice(0, r));
          if (!hmCheck.valid) {
              for (let c = 0; c < 5; c++) {
                  if (hmCheck.charError) {
                      if (rowChars[c] === hmCheck.charError && !newErrors[r][c]) newErrors[r][c] = hmCheck.error;
                  } else {
                      if (!newErrors[r][c]) newErrors[r][c] = hmCheck.error;
                  }
              }
              isWin = false;
          }
        }
        currentWords.push(word);
      }
    }

    setErrors(newErrors);
    
    if (isWin && !anyEmpty && gameState !== 'won') {
      setGameState('won');
      addPlayedWord(puzzle.target);
      setProgress({ current: getPlayedWords().length, total: DICTIONARY.length });
    } else if ((!isWin || anyEmpty) && gameState === 'won') {
      setGameState('playing'); 
    }
  }, [grid, puzzle, gameState]);

  useEffect(() => {
    validateGrid();
  }, [grid, validateGrid]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleInput = useCallback((key) => {
    if (gameState === 'won' || gameState === 'loading') return;

    setGrid(prev => {
      const newGrid = [...prev.map(r => [...r])];
      const { r, c } = activeCell;

      if (key === 'BACKSPACE') {
        if (newGrid[r][c] !== '') {
          newGrid[r][c] = '';
        } else if (c > 0) {
          newGrid[r][c - 1] = '';
          setActiveCell({ r, c: c - 1 });
        }
        return newGrid;
      }

      if (/^[A-Z]$/.test(key)) {
        newGrid[r][c] = key;
        if (c < 4) {
          setActiveCell({ r, c: c + 1 });
        } else {
          if (r < puzzle.rows - 1) setActiveCell({ r: r + 1, c: 0 });
        }
        return newGrid;
      }

      return prev;
    });
  }, [activeCell, gameState, puzzle]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') handleInput('BACKSPACE');
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char) && char.length === 1) handleInput(char);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  if (!puzzle) {
    return (
      <div className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center font-sans">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-[#050505] flex flex-col items-center justify-start pt-3 pb-8 sm:pt-5 sm:pb-10 px-2 sm:px-4 font-sans relative overflow-hidden select-none">
      
      {/* Memisahkan tag Style global agar tidak di-re-render dan mengulang animasi */}
      <style>{`
        @keyframes confetti-burst {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0);
            opacity: 1;
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); 
          }
          30% {
            transform: translate3d(var(--tx), var(--ty), 0) rotate(180deg) scale(1.2);
            opacity: 1;
            animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); 
          }
          100% {
            transform: translate3d(var(--fx), 80vh, 0) rotate(var(--r)) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Background Orbs yang lebih dinamis dan imersif */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>

      <header className="w-full max-w-lg flex flex-shrink-0 items-center justify-between z-10 pb-2 sm:pb-3 mt-1 sm:mt-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 tracking-tight">
              UNWORDLE
            </h1>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden flex flex-col border border-white/20 shadow-sm shrink-0" title="Bahasa Indonesia">
              <div className="w-full h-1/2 bg-red-600"></div>
              <div className="w-full h-1/2 bg-white"></div>
            </div>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
          <p className="text-slate-400 text-xs hidden sm:block">
            <strong className="text-white">{progress.current}</strong><span className="text-slate-500">/{progress.total}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <p className="text-slate-400 text-xs sm:hidden mr-2">
            <strong className="text-white">{progress.current}</strong><span className="text-slate-500">/{progress.total}</span>
          </p>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10 rounded-full transition-colors text-slate-300"
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button 
            onClick={() => setShowInstructions(true)}
            className="p-1.5 sm:p-2 bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10 rounded-full transition-colors text-slate-300"
            title="Cara Bermain"
          >
            <Info size={18} />
          </button>
          <button 
            onClick={() => {
              setGrid(Array(puzzle.rows).fill('').map(() => Array(5).fill('')));
              setActiveCell({r:0, c:0});
            }}
            className="p-1.5 sm:p-2 bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10 rounded-full transition-colors text-slate-300"
            title="Ulang Baris"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-2 z-10 shrink-0"></div>

      <div className="w-full flex flex-col items-center flex-1 z-10 justify-start pb-2 sm:pb-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        <main className="w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center mt-0 sm:mt-2 shrink-0">
          
          <div className={`
            absolute top-20 max-w-sm bg-rose-500/90 backdrop-blur-xl ring-1 ring-inset ring-white/20 text-white px-4 py-3 rounded-2xl shadow-xl flex items-start gap-3 transition-all duration-300 z-50
            ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
          `}>
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{toastMsg}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2 w-full">
            <span className={`text-xs sm:text-sm transition-colors ${!isHardMode ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              Normal
            </span>
            <button
              onClick={() => setIsHardMode(!isHardMode)}
              className="w-12 h-6 sm:w-14 sm:h-7 rounded-full bg-white/5 ring-1 ring-inset ring-white/10 relative transition-all focus:outline-none hover:bg-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              title={isHardMode ? "Kembali ke Normal" : "Aktifkan Hard Mode"}
            >
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full absolute top-1 sm:top-0.5 transition-all duration-300 shadow-md ${isHardMode ? 'left-[26px] sm:left-[32px] bg-rose-400' : 'left-1 bg-emerald-400'}`}></div>
            </button>
            <span className={`text-xs sm:text-sm transition-colors ${isHardMode ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
              Hard Mode
            </span>
          </div>

          <div className="flex flex-col w-full gap-1.5 sm:gap-2 p-3 sm:p-5 md:p-6 bg-white/[0.01] backdrop-blur-3xl ring-1 ring-inset ring-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">

            {grid.map((row, r) => (
              <div key={r} className="flex w-full gap-1.5 sm:gap-2">
                {row.map((letter, c) => (
                  <Tile 
                    key={`${r}-${c}`}
                    letter={letter}
                    status={puzzle.colors[r][c]}
                    isActive={gameState !== 'won' && activeCell.r === r && activeCell.c === c}
                    hasError={!!errors[r][c]}
                    onClick={() => setActiveCell({ r, c })}
                    onShowError={() => showToast(errors[r][c])}
                  />
                ))}
              </div>
            ))}

            <div className="w-full h-px bg-white/10 my-1"></div>

            <div className="flex w-full gap-1.5 sm:gap-2 opacity-95">
              {puzzle.target.split('').map((letter, i) => (
                <div key={i} className="w-full aspect-square flex items-center justify-center font-bold text-2xl sm:text-3xl md:text-4xl uppercase rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 ring-1 ring-inset ring-white/40 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] pointer-events-none">
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {gameState !== 'won' && (
            <div className="flex items-center justify-center gap-6 mt-4 w-full max-w-sm">
              <button
                onClick={handleSolve}
                className="text-xs sm:text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Nyerah ah
              </button>
              <div className="w-px h-3 bg-white/10"></div>
              <button
                onClick={startNextLevel}
                className="text-xs sm:text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
              >
                Ganti Kata
              </button>
            </div>
          )}

        </main>

        {/* Dihapus class 'animate-in' yang memicu kedipan saat komponen re-render akibat Alternatif Jawaban */}
        {gameState === 'won' ? (
          <div className="w-full max-w-lg mt-6 sm:mt-8 mb-auto flex flex-col items-center justify-center gap-2 sm:gap-4 bg-white/[0.02] backdrop-blur-2xl ring-1 ring-inset ring-white/10 p-4 sm:p-8 rounded-[2.5rem] shadow-2xl relative z-50 shrink-0">
            
            <div className="relative flex items-center justify-center mt-2 mb-2">
              <Confetti key={progress.current} />
              <div className="relative z-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-full ring-1 ring-inset ring-emerald-500/30">
                <Trophy className="w-12 h-12 md:w-14 md:h-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              </div>
            </div>

            <div className="text-center z-10">
               <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-1">Selamat!</h2>
               <p className="text-slate-300 text-xs sm:text-sm">Anda berhasil memecahkan teka-teki.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 w-full sm:w-auto z-10">
              <button 
                onClick={handleAlternative}
                className="px-6 py-2.5 sm:py-3 bg-white/10 ring-1 ring-inset ring-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-full transition-all active:scale-95 flex-1"
              >
                Alternatif Jawaban
              </button>
              <button 
                onClick={startNextLevel}
                className="px-6 py-2.5 sm:py-3 bg-gradient-to-br from-emerald-400 to-emerald-600 ring-1 ring-inset ring-white/30 hover:brightness-110 text-white text-xs sm:text-sm font-bold rounded-full shadow-[0_4px_20px_-4px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex-1"
              >
                Main Lagi
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mt-4 sm:mt-6 mb-auto flex flex-col z-10 select-none px-1 shrink-0">
            {keyboardRows.map((row, i) => (
              <div key={i} className={`flex justify-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 w-full ${i === 1 ? 'px-[5%]' : ''}`}>
                {row.map((key) => {
                  const isAction = key === 'ENTER' || key === 'BACKSPACE';
                  const status = keyStatuses[key];
                  
                  let keyStyle = 'bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/15 text-slate-200 shadow-md backdrop-blur-md';
                  if (status === 'correct') keyStyle = 'bg-gradient-to-br from-emerald-500 to-emerald-600 ring-1 ring-inset ring-white/30 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110';
                  else if (status === 'present') keyStyle = 'bg-gradient-to-br from-amber-500 to-amber-600 ring-1 ring-inset ring-white/30 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110';
                  else if (status === 'absent') keyStyle = 'bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-inset ring-white/5 text-white/40 shadow-inner';

                  return (
                    <button
                      key={key}
                      onClick={() => handleInput(key)}
                      className={`
                        flex items-center justify-center font-bold rounded-xl transition-all active:scale-90
                        ${isAction ? 'flex-[1.5] text-[10px] sm:text-xs bg-white/10 ring-1 ring-inset ring-white/10 hover:bg-white/20 text-white backdrop-blur-md' 
                                   : `flex-1 text-sm sm:text-base ${keyStyle}`}
                        h-12 sm:h-14
                      `}
                    >
                      {key === 'BACKSPACE' ? <Delete size={20} /> : key === 'ENTER' ? 'ENT' : key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

      </div>

      {showInstructions && <InstructionModal onClose={() => setShowInstructions(false)} />}
    </div>
  );
}
