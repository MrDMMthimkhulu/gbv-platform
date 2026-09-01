// Official NPA list of operational Thuthuzela Care Centres in South Africa,
// dated 30 March 2026. Source: npa.gov.za
// Used by the "Bulk import TCCs" button on /admin/shelters — each entry gets
// geocoded in the browser and inserted into the shelters table wit
// facility_type: 'tcc'.

export const TCC_LIST = [
  // Eastern Cape
  { name: 'Bizana TCC', province: 'Eastern Cape', district: 'Alfred Nzo DM', address: "St Patrick's Hospital, Hope Street, Bizana, 4800, South Africa" },
  { name: 'Matatiele TCC', province: 'Eastern Cape', district: 'Alfred Nzo DM', address: 'Taylor Bequest Hospital, 1 Main Street, Matatiele, 4730, South Africa' },
  { name: 'Butterworth TCC', province: 'Eastern Cape', district: 'Amathole DM', address: 'Butterworth Hospital, Cnr Scanlen & Geach Street, Butterworth, 4960, South Africa' },
  { name: 'Qonce TCC', province: 'Eastern Cape', district: 'Amathole DM', address: 'Grey Hospital, 54 Kings Road, Qonce, 5601, South Africa' },
  { name: 'Mdantsane TCC', province: 'Eastern Cape', district: 'Buffalo City DM', address: 'Cecilia Makhiwane Hospital, 4 Billie Road, Mdantsane, 5219, South Africa' },
  { name: 'Cradock TCC', province: 'Eastern Cape', district: 'Chris Hani DM', address: 'Cradock Hospital, 30 Hospitaal Street, Cradock, 5880, South Africa' },
  { name: 'Komani TCC', province: 'Eastern Cape', district: 'Chris Hani DM', address: 'Frontier Hospital, Cnr Kingsway & Livingston Road, Queenstown, 5319, South Africa' },
  { name: 'Gqeberha Dora Nginza TCC', province: 'Eastern Cape', district: 'Nelson Mandela DM', address: 'Dora Nginza Hospital, Spondo Street, Salt Pan, Gqeberha, 6059, South Africa' },
  { name: 'Flagstaff TCC', province: 'Eastern Cape', district: 'O R Tambo DM', address: 'Holy Cross Hospital, Holy Cross Mission Taweni Location, Flagstaff, 4810, South Africa' },
  { name: 'Libode TCC', province: 'Eastern Cape', district: 'O R Tambo DM', address: 'St Barnabas Hospital, Nyandeni Region, R61, Libode, 5160, South Africa' },
  { name: 'Lusikisiki TCC', province: 'Eastern Cape', district: 'O R Tambo DM', address: 'St Elizabeth Hospital, R61 Main Street, Lusikisiki, 4820, South Africa' },
  { name: 'Mthatha Sinawe TCC', province: 'Eastern Cape', district: 'O R Tambo DM', address: '68 Blakeway Road, Mthatha Central, Mthatha, 5100, South Africa' },

  // Free State
  { name: 'Sasolburg TCC', province: 'Free State', district: 'Fezile Dabi DM', address: 'Metsimaholo District Hospital, 8 Langenhoven Street, Sasolburg, 1948, South Africa' },
  { name: 'Welkom TCC', province: 'Free State', district: 'Lejweleputswa DM', address: 'Bongani Regional Hospital, Mothusi Road, Thabong, Welkom, 9463, South Africa' },
  { name: 'Bloemfontein Tshepong TCC', province: 'Free State', district: 'Mangaung MM', address: 'National District Hospital, Roth Avenue, Willows, Bloemfontein, 9301, South Africa' },
  { name: 'Bethlehem TCC', province: 'Free State', district: 'Thabo Mofutsanyana DM', address: 'Phekolong Hospital, 2117 Riemland Road, Bohlokong, Bethlehem, 9701, South Africa' },
  { name: 'Phuthaditjhaba TCC', province: 'Free State', district: 'Thabo Mofutsanyana DM', address: 'Elisabeth Ross Hospital, 597 Mothibang, Manguang Village, Phuthaditjhaba, 9869, South Africa' },

  // Gauteng
  { name: 'Vosloorus Sinakekelwe TCC', province: 'Gauteng', district: 'Ekurhuleni MM', address: 'Thelle Mogoerane Regional Hospital, Nguza Street, Vosloorus, 1486, South Africa' },
  { name: 'Tembisa Masakhane TCC', province: 'Gauteng', district: 'Ekurhuleni MM', address: 'Tembisa Hospital, Cnr Flint Mazibuko & Reverend RTJ Ntamane Drive, Tembisa, 1632, South Africa' },
  { name: 'Lenasia TCC', province: 'Gauteng', district: 'Johannesburg MM', address: 'Lenasia South Hospital, 03 Cosmos Street, Lenasia, 1821, South Africa' },
  { name: 'Soweto Nthabiseng TCC', province: 'Gauteng', district: 'Johannesburg MM', address: 'Chris Hani Baragwanath Hospital, Old Potchefstroom Road, Diepkloof, 1864, South Africa' },
  { name: 'Kopanong TCC', province: 'Gauteng', district: 'Sedibeng DM', address: 'Kopanong Hospital, 2 Casino Road, Duncanville, Vereeniging, 1939, South Africa' },
  { name: 'Laudium TCC', province: 'Gauteng', district: 'Tshwane MM', address: 'Laudium Community Health Centre, Cnr Bengal & 25th Avenue, Laudium, 0037, South Africa' },
  { name: 'Mamelodi TCC', province: 'Gauteng', district: 'Tshwane MM', address: 'Mamelodi Day Hospital, Serapeng Street & Tsamaya Road, Mamelodi East, 0122, South Africa' },

  // KwaZulu-Natal
  { name: 'Madadeni TCC', province: 'KwaZulu-Natal', district: 'Amajuba DM', address: 'Madadeni Hospital, Section 6, Madadeni, 2951, South Africa' },
  { name: 'Chatsworth TCC', province: 'KwaZulu-Natal', district: 'eThekwini MM', address: 'RK Khan Hospital, RK Khan Circle, Westcliffe, 4092, South Africa' },
  { name: 'Pixley ka Isaka Seme TCC', province: 'KwaZulu-Natal', district: 'eThekwini MM', address: 'Dr Pixley ka Isaka Seme Memorial Hospital, 310 Bhejane Street, KwaMashu, 4360, South Africa' },
  { name: 'Umlazi TCC', province: 'KwaZulu-Natal', district: 'eThekwini MM', address: 'Prince Mshiyeni Memorial Hospital, Off Mangosuthu Highway, Umlazi, 4061, South Africa' },
  { name: 'Rietvlei TCC', province: 'KwaZulu-Natal', district: 'Harry Gwala DM', address: 'Rietvlei Hospital, R56, Rietvlei Location Ward 12, Umzimkhulu, 3297, South Africa' },
  { name: 'Ngwelezane TCC', province: 'KwaZulu-Natal', district: 'King Cetshwayo DM', address: 'Ngwelezane Hospital, Cnr Thanduyise & Ngwelezana Road, Empangeni, 3880, South Africa' },
  { name: 'Stanger TCC', province: 'KwaZulu-Natal', district: 'iLembe DM', address: 'Stanger Regional Hospital, Cnr King Shaka & Patterson Roads, Stanger, 4450, South Africa' },
  { name: 'Port Shepstone TCC', province: 'KwaZulu-Natal', district: 'Ugu DM', address: 'Port Shepstone Regional Hospital, Bazley Street, Port Shepstone, 4240, South Africa' },
  { name: 'Edendale TCC', province: 'KwaZulu-Natal', district: 'uMgungundlovu DM', address: 'Edendale Hospital, Moses Mabhida Road, Plessislaer, Edendale, 3201, South Africa' },
  { name: 'Jozini TCC', province: 'KwaZulu-Natal', district: 'uMkhanyakude DM', address: 'Othobothini Community Health Centre, Msiyane Area, Jozini, 3969, South Africa' },

  // Limpopo
  { name: 'Seshego TCC', province: 'Limpopo', district: 'Capricorn DM', address: 'Seshego Hospital, Cnr Bookelo & Mandela Street, Zone 1, Seshego, 0742, South Africa' },
  { name: 'Mankweng TCC', province: 'Limpopo', district: 'Capricorn DM', address: 'Mankweng Hospital, Houtbosdorp Road, Sovenga, 0727, South Africa' },
  { name: 'Dilokong TCC', province: 'Limpopo', district: 'Greater Sekhukhune DM', address: 'Dilokong Hospital, Cnr R37 & Modikwa Platinum Road, Driekop, 1129, South Africa' },
  { name: 'Giyani TCC', province: 'Limpopo', district: 'Mopani DM', address: 'Nkhesani Hospital, Giyani Factory Unit, Giyani, 0826, South Africa' },
  { name: 'Groblersdal TCC', province: 'Limpopo', district: 'Sekhukhune DM', address: 'Groblersdal Hospital, 18 Voortrekker Street, Groblersdal, 0470, South Africa' },
  { name: 'Musina TCC', province: 'Limpopo', district: 'Vhembe DM', address: 'Messina Hospital, Cnr Calderwood and Whyte Road, Musina, 0900, South Africa' },
  { name: 'Tshilidzini TCC', province: 'Limpopo', district: 'Vhembe DM', address: 'Tshilidzini Hospital, R524 Punda Maria Road, Tshisaulu, 0945, South Africa' },
  { name: 'Mokopane TCC', province: 'Limpopo', district: 'Waterberg DM', address: 'Mokopane Hospital, Dudu Madisha Drive, Mokopane, 0600, South Africa' },

  // Mpumalanga
  { name: 'Kabokweni Themba TCC', province: 'Mpumalanga', district: 'Ehlanzeni DM', address: 'Themba Hospital, Kabokweni Main Road, Kabokweni, 1245, South Africa' },
  { name: 'Nelspruit Rob Ferreira TCC', province: 'Mpumalanga', district: 'Ehlanzeni DM', address: 'Rob Ferreira Hospital, Cnr Piet Retief Street and Madiba Drive, Nelspruit, 1200, South Africa' },
  { name: 'Tonga TCC', province: 'Mpumalanga', district: 'Ehlanzeni DM', address: 'Tonga Hospital, Mangweni Road, Kwalugedlane, Tonga, 1341, South Africa' },
  { name: 'Emalahleni Witbank TCC', province: 'Mpumalanga', district: 'Nkangala DM', address: 'Witbank Provincial Hospital, Mandela Ave, Witbank, 1035, South Africa' },
  { name: 'Evander TCC', province: 'Mpumalanga', district: 'Gert Sibande DM', address: 'Evander Hospital, Cnr Bologna Street & Lausanne Road, Evander, 2280, South Africa' },
  { name: 'Ermelo TCC', province: 'Mpumalanga', district: 'Gert Sibande DM', address: 'Ermelo Hospital, 1 Joubert Street, Ermelo, 2350, South Africa' },

  // Northern Cape
  { name: 'Galeshewe TCC', province: 'Northern Cape', district: 'Frances Baard DM', address: 'Galeshewe Day Hospital, Tyson Road, Kimberley, 8301, South Africa' },
  { name: 'Kuruman TCC', province: 'Northern Cape', district: 'John Taolo Gaetsewe DM', address: 'Kuruman Hospital, N14 Main Road, Kuruman, 8460, South Africa' },
  { name: 'Springbok TCC', province: 'Northern Cape', district: 'Namakwa DM', address: 'Dr van Niekerk Hospital, Hospital Road, Springbok, 8240, South Africa' },
  { name: 'De Aar TCC', province: 'Northern Cape', district: 'Pixley Ka Seme DM', address: 'Central Karoo Hospital, Van de Merwe Street, De Aar, 7000, South Africa' },
  { name: 'Upington TCC', province: 'Northern Cape', district: 'Siyanda DM (ZF Mgcawu)', address: 'Dr Harry Surtie Hospital, Upington Drive and Turner Street, Upington, 8801, South Africa' },

  // North West
  { name: 'Rustenburg TCC', province: 'North West', district: 'Bojanala DM', address: 'Job Shimankane Tabane Hospital, Cnr Heystek & Bosch Streets, Rustenburg, 0299, South Africa' },
  { name: 'Klerksdorp TCC', province: 'North West', district: 'Dr Kenneth Kaunda DM', address: 'Tshepong Hospital, Benji-Oliphant Road, Jouberton, Klerksdorp, 2570, South Africa' },
  { name: 'Potchefstroom TCC', province: 'North West', district: 'Dr Kenneth Kaunda DM', address: 'Potchefstroom Hospital, Cnr Chris Hani & Kruis Streets, Potchefstroom, 2531, South Africa' },
  { name: 'Mahikeng TCC', province: 'North West', district: 'Ngaka Modiri Molema DM', address: 'Mafikeng Provincial Hospital, Lichtenburg Road, Mahikeng, 2745, South Africa' },
  { name: 'Taung TCC', province: 'North West', district: 'Dr Ruth Segomotsi Mompati DM', address: 'Taung District Hospital, Magistrate Road, Taung, 8584, South Africa' },

  // Western Cape
  { name: 'Atlantis TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Wesfleur Hospital, Wesfleur Circle, Atlantis, 7349, South Africa' },
  { name: 'Heideveld TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Heideveld Emergency Centre, Heideveld Road, Heideveld, 7764, South Africa' },
  { name: 'Karl Bremer Bellville TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Karl Bremer Hospital, Cnr Mike Pienaar and Frans Conradie Boulevard, Bellville, 7530, South Africa' },
  { name: 'Khayelitsha TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Khayelitsha District Hospital, Cnr Walter Sisulu & Steve Biko, Khayelitsha, 7784, South Africa' },
  { name: 'Mitchells Plain TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Mitchells Plain Hospital, 8 AZ Berman Drive, Lentegeur, 7785, South Africa' },
  { name: 'Victoria Hospital Wynberg TCC', province: 'Western Cape', district: 'Cape Town MM', address: 'Victoria Hospital, 1 Alphen Road, Wynberg, 7800, South Africa' },
  { name: 'Paarl TCC', province: 'Western Cape', district: 'Cape Winelands DM', address: 'Paarl Hospital, Hospital Street, Paarl, 7646, South Africa' },
  { name: 'Stellenbosch TCC', province: 'Western Cape', district: 'Cape Winelands DM', address: 'Cnr Helshoogte & Protea Roads, Idas Valley, Stellenbosch, 7600, South Africa' },
  { name: 'Worcester TCC', province: 'Western Cape', district: 'Cape Winelands DM', address: 'Worcester Hospital, Murray Street, Worcester, 6849, South Africa' },
  { name: 'George TCC', province: 'Western Cape', district: 'Eden DM (Garden Route)', address: 'George Provincial Hospital, Cnr Davidson and Langenhoven Road, Heatherlands, George, 6529, South Africa' },
];
