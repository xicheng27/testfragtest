param([switch]$OnlyMissing)

$ErrorActionPreference = 'Stop'

$items = @(
  @{ id = 'bleu-chanel'; query = 'Bleu de Chanel parfum'; domain = 'chanel.com' },
  @{ id = 'black-orchid'; query = 'Tom Ford Black Orchid eau de parfum'; domain = 'tomfordbeauty.com' },
  @{ id = 'libre-ysl'; query = 'YSL Libre eau de parfum'; domain = 'yslbeautyus.com' },
  @{ id = 'sauvage-dior'; query = 'Dior Sauvage eau de parfum'; domain = 'dior.com' },
  @{ id = 'chance-chanel'; query = 'Chanel Chance Eau Tendre'; domain = 'chanel.com' },
  @{ id = 'aventus-creed'; query = 'Creed Aventus'; domain = 'creedboutique.com' },
  @{ id = 'oud-wood-tf'; query = 'Tom Ford Oud Wood eau de parfum'; domain = 'tomfordbeauty.com' },
  @{ id = 'flowerbomb-vf'; query = 'Viktor Rolf Flowerbomb eau de parfum'; domain = 'viktor-rolf.com' },
  @{ id = 'silver-mountain-creed'; query = 'Creed Silver Mountain Water'; domain = 'creedboutique.com' },
  @{ id = 'neroli-portofino-tf'; query = 'Tom Ford Neroli Portofino'; domain = 'tomfordbeauty.com' },
  @{ id = 'tobacco-vanille-tf'; query = 'Tom Ford Tobacco Vanille'; domain = 'tomfordbeauty.com' },
  @{ id = 'good-girl-cg'; query = 'Carolina Herrera Good Girl eau de parfum'; domain = 'carolinaherrera.com' },
  @{ id = 'acqua-armani'; query = 'Giorgio Armani Acqua di Gio eau de toilette'; domain = 'giorgioarmanibeauty-usa.com' },
  @{ id = 'la-vie-est-belle'; query = 'Lancome La Vie Est Belle eau de parfum'; domain = 'lancome-usa.com' },
  @{ id = 'molecule-01'; query = 'Escentric Molecules Molecule 01'; domain = 'escentric.com' },
  @{ id = 'lost-cherry-tf'; query = 'Tom Ford Lost Cherry'; domain = 'tomfordbeauty.com' },
  @{ id = 'santal-33-le-labo'; query = 'Le Labo Santal 33'; domain = 'lelabofragrances.com' },
  @{ id = 'miss-dior-dior'; query = 'Miss Dior eau de parfum'; domain = 'dior.com' },
  @{ id = 'rose-oud-bdk'; query = 'BDK Parfums Gris Charnel'; domain = 'bdkparfums.com' },
  @{ id = 'light-blue-dolce'; query = 'Dolce Gabbana Light Blue eau de toilette'; domain = 'dolcegabbana.com' },
  @{ id = 'eros-versace'; query = 'Versace Eros eau de toilette'; domain = 'versace.com' },
  @{ id = 'si-armani'; query = 'Giorgio Armani Si Passione eau de parfum'; domain = 'giorgioarmanibeauty-usa.com' },
  @{ id = 'the-one-dolce'; query = 'Dolce Gabbana The One for men eau de parfum'; domain = 'dolcegabbana.com' },
  @{ id = 'black-phantom-kilian'; query = 'Kilian Black Phantom'; domain = 'bykilian.com' },
  @{ id = 'versace-bright-crystal'; query = 'Versace Bright Crystal eau de toilette'; domain = 'versace.com' },
  @{ id = 'baccarat-rouge-540'; query = 'Maison Francis Kurkdjian Baccarat Rouge 540'; domain = 'franciskurkdjian.com' },
  @{ id = 'replica-jazz-club'; query = 'Maison Margiela REPLICA Jazz Club'; domain = 'maisonmargiela-fragrances.us' },
  @{ id = 'replica-by-the-fireplace'; query = 'Maison Margiela REPLICA By the Fireplace'; domain = 'maisonmargiela-fragrances.us' },
  @{ id = 'replica-lazy-sunday-morning'; query = 'Maison Margiela REPLICA Lazy Sunday Morning'; domain = 'maisonmargiela-fragrances.us' },
  @{ id = 'dossier-ambery-saffron'; query = 'Dossier Ambery Saffron'; domain = 'dossier.co' },
  @{ id = 'dossier-woody-sandalwood'; query = 'Dossier Woody Sandalwood'; domain = 'dossier.co' },
  @{ id = 'oakcha-sinful'; query = 'Oakcha Sinful'; domain = 'oakcha.com' },
  @{ id = 'oakcha-sweven'; query = 'Oakcha Sweven'; domain = 'oakcha.com' },
  @{ id = 'alt-executive'; query = 'ALT Fragrances Executive'; domain = 'altfragrances.com' },
  @{ id = 'alt-farouche'; query = 'ALT Fragrances Farouche'; domain = 'altfragrances.com' },
  @{ id = 'alt-fireside-marshmallow'; query = 'ALT Fragrances Fireside Marshmallow'; domain = 'altfragrances.com' }
  @{ id = 'dior-homme-intense'; query = 'Dior Homme Intense eau de parfum'; domain = 'dior.com' }
  @{ id = 'ysl-y-edp'; query = 'YSL Y eau de parfum'; domain = 'yslbeautyus.com' }
  @{ id = 'prada-lhomme'; query = 'Prada L Homme eau de toilette'; domain = 'prada-beauty.com' }
  @{ id = 'terre-hermes'; query = 'Terre d Hermes eau de toilette'; domain = 'hermes.com' }
  @{ id = 'gucci-bloom'; query = 'Gucci Bloom eau de parfum'; domain = 'gucci.com' }
  @{ id = 'burberry-her'; query = 'Burberry Her eau de parfum'; domain = 'burberry.com' }
  @{ id = 'valentino-donna-born-in-roma'; query = 'Valentino Donna Born in Roma eau de parfum'; domain = 'valentino-beauty.us' }
  @{ id = 'armani-my-way'; query = 'Giorgio Armani My Way eau de parfum'; domain = 'giorgioarmanibeauty-usa.com' }
  @{ id = 'mon-guerlain'; query = 'Mon Guerlain eau de parfum'; domain = 'guerlain.com' }
  @{ id = 'narciso-rodriguez-for-her'; query = 'Narciso Rodriguez For Her eau de toilette'; domain = 'narcisorodriguezparfums.com' }
  @{ id = 'ck-one'; query = 'Calvin Klein CK One eau de toilette'; domain = 'calvinklein.us' }
  @{ id = 'davidoff-cool-water'; query = 'Davidoff Cool Water eau de toilette'; domain = 'davidoff.com' }
  @{ id = 'issey-miyake-leau-dissey'; query = 'Issey Miyake L Eau d Issey eau de toilette'; domain = 'isseymiyakeparfums.com' }
  @{ id = 'mugler-alien'; query = 'Mugler Alien eau de parfum'; domain = 'mugler.com' }
  @{ id = 'mugler-angel'; query = 'Mugler Angel eau de parfum'; domain = 'mugler.com' }
  @{ id = 'jpg-le-male-le-parfum'; query = 'Jean Paul Gaultier Le Male Le Parfum'; domain = 'jeanpaulgaultier.com' }
  @{ id = 'jpg-la-belle'; query = 'Jean Paul Gaultier La Belle eau de parfum'; domain = 'jeanpaulgaultier.com' }
  @{ id = 'paco-rabanne-one-million'; query = 'Rabanne 1 Million eau de toilette'; domain = 'rabanne.com' }
  @{ id = 'chloe-signature'; query = 'Chloe eau de parfum signature'; domain = 'chloe.com' }
  @{ id = 'boss-bottled'; query = 'Hugo Boss Bottled eau de toilette'; domain = 'hugoboss.com' }
  @{ id = 'le-labo-another-13'; query = 'Le Labo Another 13'; domain = 'lelabofragrances.com' }
  @{ id = 'diptyque-philosykos'; query = 'Diptyque Philosykos eau de parfum'; domain = 'diptyqueparis.com' }
  @{ id = 'byredo-bal-dafrique'; query = 'Byredo Bal d Afrique eau de parfum'; domain = 'byredo.com' }
  @{ id = 'byredo-gypsy-water'; query = 'Byredo Gypsy Water eau de parfum'; domain = 'byredo.com' }
  @{ id = 'byredo-mojave-ghost'; query = 'Byredo Mojave Ghost eau de parfum'; domain = 'byredo.com' }
  @{ id = 'parfums-de-marly-delina'; query = 'Parfums de Marly Delina eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'parfums-de-marly-layton'; query = 'Parfums de Marly Layton eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'parfums-de-marly-greenley'; query = 'Parfums de Marly Greenley eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'xerjoff-naxos'; query = 'Xerjoff Naxos eau de parfum'; domain = 'xerjoff.com' }
  @{ id = 'xerjoff-erba-pura'; query = 'Xerjoff Erba Pura eau de parfum'; domain = 'xerjoff.com' }
  @{ id = 'nishane-ani'; query = 'Nishane Ani extrait de parfum'; domain = 'nishane.com' }
  @{ id = 'nishane-wulong-cha'; query = 'Nishane Wulong Cha extrait de parfum'; domain = 'nishane.com' }
  @{ id = 'jo-malone-wood-sage-sea-salt'; query = 'Jo Malone Wood Sage Sea Salt cologne'; domain = 'jomalone.com' }
  @{ id = 'jo-malone-english-pear-freesia'; query = 'Jo Malone English Pear Freesia cologne'; domain = 'jomalone.com' }
  @{ id = 'le-labo-the-matcha-26'; query = 'Le Labo The Matcha 26'; domain = 'lelabofragrances.com' }
  @{ id = 'mfk-gentle-fluidity-gold'; query = 'Maison Francis Kurkdjian Gentle Fluidity Gold'; domain = 'franciskurkdjian.com' }
  @{ id = 'ariana-grande-cloud'; query = 'Ariana Grande Cloud eau de parfum'; domain = 'arianagrandefragrances.com' }
  @{ id = 'billie-eilish-eilish'; query = 'Billie Eilish Eilish eau de parfum'; domain = 'billieeilishfragrances.com' }
  @{ id = 'ariana-grande-sweet-like-candy'; query = 'Ariana Grande Sweet Like Candy eau de parfum'; domain = 'arianagrandefragrances.com' }
  @{ id = 'britney-spears-fantasy'; query = 'Britney Spears Fantasy eau de parfum'; domain = 'britneyspearsfragrances.com' }
  @{ id = 'lattafa-khamrah'; query = 'Lattafa Khamrah eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'lattafa-yara'; query = 'Lattafa Yara eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'lattafa-asad'; query = 'Lattafa Asad eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'afnan-9pm'; query = 'Afnan 9PM eau de parfum'; domain = 'afnan.com' }
  @{ id = 'armaf-club-de-nuit-intense-man'; query = 'Armaf Club de Nuit Intense Man'; domain = 'armaf.com' }
  @{ id = 'al-haramain-amber-oud-gold'; query = 'Al Haramain Amber Oud Gold Edition'; domain = 'alharamainperfumes.com' }
  @{ id = 'zara-red-temptation'; query = 'Zara Red Temptation eau de parfum'; domain = 'zara.com' }
  @{ id = 'zara-gardenia'; query = 'Zara Gardenia eau de parfum'; domain = 'zara.com' }
  @{ id = 'montblanc-explorer'; query = 'Montblanc Explorer eau de parfum'; domain = 'montblanc.com' }
  @{ id = 'glossier-you'; query = 'Glossier You eau de parfum'; domain = 'glossier.com' }
  @{ id = 'clean-reserve-skin'; query = 'Clean Reserve Skin eau de parfum'; domain = 'cleanbeauty.com' }
  @{ id = 'chanel-coco-mademoiselle'; query = 'Chanel Coco Mademoiselle eau de parfum'; domain = 'chanel.com' }
  @{ id = 'chanel-no-5'; query = 'Chanel No 5 eau de parfum'; domain = 'chanel.com' }
  @{ id = 'dior-jadore'; query = 'Dior J adore eau de parfum'; domain = 'dior.com' }
  @{ id = 'ysl-black-opium'; query = 'YSL Black Opium eau de parfum'; domain = 'yslbeautyus.com' }
  @{ id = 'prada-paradoxe'; query = 'Prada Paradoxe eau de parfum'; domain = 'prada-beauty.com' }
  @{ id = 'dolce-gabbana-devotion'; query = 'Dolce Gabbana Devotion eau de parfum'; domain = 'dolcegabbana.com' }
  @{ id = 'lancome-idole'; query = 'Lancome Idole eau de parfum'; domain = 'lancome-usa.com' }
  @{ id = 'viktor-rolf-spicebomb-extreme'; query = 'Viktor Rolf Spicebomb Extreme eau de parfum'; domain = 'viktor-rolf.com' }
  @{ id = 'armani-stronger-with-you-intensely'; query = 'Armani Stronger With You Intensely'; domain = 'giorgioarmanibeauty-usa.com' }
  @{ id = 'valentino-uomo-born-in-roma-intense'; query = 'Valentino Uomo Born in Roma Intense'; domain = 'valentino-beauty.us' }
  @{ id = 'givenchy-gentleman-reserve-privee'; query = 'Givenchy Gentleman Reserve Privee'; domain = 'givenchybeauty.com' }
  @{ id = 'acqua-di-gio-profondo'; query = 'Giorgio Armani Acqua di Gio Profondo'; domain = 'giorgioarmanibeauty-usa.com' }
  @{ id = 'versace-dylan-blue'; query = 'Versace Dylan Blue eau de toilette'; domain = 'versace.com' }
  @{ id = 'amouage-guidance'; query = 'Amouage Guidance eau de parfum'; domain = 'amouage.com' }
  @{ id = 'amouage-reflection-man'; query = 'Amouage Reflection Man eau de parfum'; domain = 'amouage.com' }
  @{ id = 'initio-side-effect'; query = 'Initio Side Effect eau de parfum'; domain = 'initioparfums.com' }
  @{ id = 'initio-musk-therapy'; query = 'Initio Musk Therapy eau de parfum'; domain = 'initioparfums.com' }
  @{ id = 'mancera-cedrat-boise'; query = 'Mancera Cedrat Boise eau de parfum'; domain = 'manceraparfums.com' }
  @{ id = 'mancera-instant-crush'; query = 'Mancera Instant Crush eau de parfum'; domain = 'manceraparfums.com' }
  @{ id = 'montale-intense-cafe'; query = 'Montale Intense Cafe eau de parfum'; domain = 'montaleparfums.com' }
  @{ id = 'juliette-has-a-gun-not-a-perfume'; query = 'Juliette Has a Gun Not a Perfume'; domain = 'juliettehasagun.com' }
  @{ id = 'kayali-vanilla-28'; query = 'Kayali Vanilla 28 eau de parfum'; domain = 'hudabeauty.com' }
  @{ id = 'kayali-yum-pistachio-gelato'; query = 'Kayali Yum Pistachio Gelato 33'; domain = 'hudabeauty.com' }
  @{ id = 'commodity-milk-expressive'; query = 'Commodity Milk Expressive fragrance'; domain = 'commodityfragrances.com' }
  @{ id = 'phlur-missing-person'; query = 'Phlur Missing Person eau de parfum'; domain = 'phlur.com' }
  @{ id = 'replica-beach-walk'; query = 'Maison Margiela REPLICA Beach Walk'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-coffee-break'; query = 'Maison Margiela REPLICA Coffee Break'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'lattafa-eclaire'; query = 'Lattafa Eclaire eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'lattafa-liam-grey'; query = 'Lattafa Liam Grey eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'maison-alhambra-bright-peach'; query = 'Maison Alhambra Bright Peach eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'maison-alhambra-lovely-cherie'; query = 'Maison Alhambra Lovely Cherie eau de parfum'; domain = 'lattafa-usa.com' }
  @{ id = 'zoologist-bee'; query = 'Zoologist Bee deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-squid'; query = 'Zoologist Squid deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-cow'; query = 'Zoologist Cow deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-harvest-mouse'; query = 'Zoologist Harvest Mouse deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-rabbit'; query = 'Zoologist Rabbit deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-penguin'; query = 'Zoologist Penguin deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-tyrannosaurus-rex'; query = 'Zoologist Tyrannosaurus Rex deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-moth'; query = 'Zoologist Moth deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-seahorse'; query = 'Zoologist Seahorse deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-snowy-owl'; query = 'Zoologist Snowy Owl deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-camel'; query = 'Zoologist Camel deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-panda'; query = 'Zoologist Panda deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-hummingbird'; query = 'Zoologist Hummingbird deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-chameleon'; query = 'Zoologist Chameleon deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-sacred-scarab'; query = 'Zoologist Sacred Scarab deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-tiger'; query = 'Zoologist Tiger deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-king-cobra'; query = 'Zoologist King Cobra deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'zoologist-portuguese-man-o-war'; query = 'Zoologist Portuguese Man O War deluxe bottle'; domain = 'zoologistperfumes.com' }
  @{ id = 'replica-whispers-in-the-library'; query = 'Maison Margiela REPLICA Whispers in the Library'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-when-the-rain-stops'; query = 'Maison Margiela REPLICA When the Rain Stops'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-autumn-vibes'; query = 'Maison Margiela REPLICA Autumn Vibes'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-matcha-meditation'; query = 'Maison Margiela REPLICA Matcha Meditation'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-bubble-bath'; query = 'Maison Margiela REPLICA Bubble Bath'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-sailing-day'; query = 'Maison Margiela REPLICA Sailing Day'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-springtime-in-a-park'; query = 'Maison Margiela REPLICA Springtime in a Park'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-under-the-lemon-trees'; query = 'Maison Margiela REPLICA Under the Lemon Trees'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-flower-market'; query = 'Maison Margiela REPLICA Flower Market'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-at-the-barbers'; query = 'Maison Margiela REPLICA At the Barbers'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-afternoon-delight'; query = 'Maison Margiela REPLICA Afternoon Delight'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-up-at-dawn'; query = 'Maison Margiela REPLICA Up at Dawn'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-chasing-sunsets'; query = 'Maison Margiela REPLICA Chasing Sunsets'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-never-ending-summer'; query = 'Maison Margiela REPLICA Never Ending Summer'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-on-a-date'; query = 'Maison Margiela REPLICA On a Date'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-from-the-garden'; query = 'Maison Margiela REPLICA From the Garden'; domain = 'maisonmargiela-fragrances.us' }
  @{ id = 'replica-soul-of-the-forest'; query = 'Maison Margiela REPLICA Soul of the Forest'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-celestial-whispers'; query = 'Maison Margiela REPLICA Celestial Whispers'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-flying'; query = 'Maison Margiela REPLICA Flying'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-dancing-on-the-moon'; query = 'Maison Margiela REPLICA Dancing on the Moon'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'replica-ideal-one'; query = 'Maison Margiela REPLICA Ideal One'; domain = 'maisonmargiela-fragrances.eu' }
  @{ id = 'mfk-baccarat-rouge-540-extrait'; query = 'Maison Francis Kurkdjian Baccarat Rouge 540 Extrait'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-724'; query = 'Maison Francis Kurkdjian 724 eau de parfum'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-aqua-universalis'; query = 'Maison Francis Kurkdjian Aqua Universalis'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-aqua-vitae'; query = 'Maison Francis Kurkdjian Aqua Vitae'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-aqua-celestia-cologne-forte'; query = 'Maison Francis Kurkdjian Aqua Celestia Cologne forte'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-aqua-media-cologne-forte'; query = 'Maison Francis Kurkdjian Aqua Media Cologne forte'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-petit-matin'; query = 'Maison Francis Kurkdjian Petit Matin'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-grand-soir'; query = 'Maison Francis Kurkdjian Grand Soir'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-gentle-fluidity-silver'; query = 'Maison Francis Kurkdjian Gentle Fluidity Silver'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-oud'; query = 'Maison Francis Kurkdjian OUD eau de parfum'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-oud-satin-mood'; query = 'Maison Francis Kurkdjian Oud Satin Mood eau de parfum'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-oud-satin-mood-extrait'; query = 'Maison Francis Kurkdjian Oud Satin Mood Extrait'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-oud-silk-mood'; query = 'Maison Francis Kurkdjian Oud Silk Mood'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-apom'; query = 'Maison Francis Kurkdjian APOM eau de parfum'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-a-la-rose'; query = 'Maison Francis Kurkdjian A la rose'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-lhomme-a-la-rose'; query = 'Maison Francis Kurkdjian L Homme A la rose'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-amyris-femme'; query = 'Maison Francis Kurkdjian Amyris femme'; domain = 'franciskurkdjian.com' }
  @{ id = 'mfk-amyris-homme'; query = 'Maison Francis Kurkdjian Amyris homme'; domain = 'franciskurkdjian.com' }
  @{ id = 'diptyque-eau-duelle-edp'; query = 'Diptyque Eau Duelle eau de parfum'; domain = 'diptyqueparis.com' }
  @{ id = 'diptyque-orpheon'; query = 'Diptyque Orpheon eau de parfum'; domain = 'diptyqueparis.com' }
  @{ id = 'diptyque-fleur-de-peau'; query = 'Diptyque Fleur de Peau eau de parfum'; domain = 'diptyqueparis.com' }
  @{ id = 'le-labo-rose-31'; query = 'Le Labo Rose 31 eau de parfum'; domain = 'lelabofragrances.com' }
  @{ id = 'le-labo-the-noir-29'; query = 'Le Labo The Noir 29 eau de parfum'; domain = 'lelabofragrances.com' }
  @{ id = 'le-labo-bergamote-22'; query = 'Le Labo Bergamote 22 eau de parfum'; domain = 'lelabofragrances.com' }
  @{ id = 'byredo-blanche'; query = 'Byredo Blanche eau de parfum'; domain = 'byredo.com' }
  @{ id = 'byredo-bibliotheque'; query = 'Byredo Bibliotheque eau de parfum'; domain = 'byredo.com' }
  @{ id = 'byredo-sundazed'; query = 'Byredo Sundazed eau de parfum'; domain = 'byredo.com' }
  @{ id = 'parfums-de-marly-herod'; query = 'Parfums de Marly Herod eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'parfums-de-marly-althair'; query = 'Parfums de Marly Althair eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'parfums-de-marly-valaya'; query = 'Parfums de Marly Valaya eau de parfum'; domain = 'parfums-de-marly.com' }
  @{ id = 'kilian-angels-share'; query = 'Kilian Angels Share eau de parfum'; domain = 'bykilian.com' }
  @{ id = 'kilian-love-dont-be-shy'; query = 'Kilian Love Dont Be Shy eau de parfum'; domain = 'bykilian.com' }
  @{ id = 'nishane-hacivat'; query = 'Nishane Hacivat extrait de parfum'; domain = 'nishane.com' }
)

$trustedRetailers = @(
  'sephora.com',
  'sephora.com.au',
  'sephora.co.uk',
  'sephora.fr',
  'sephora.it',
  'sephora.pt',
  'ulta.com',
  'nordstrom.com',
  'macys.com',
  'bloomingdales.com',
  'fragrancenet.com',
  'fragrancex.com',
  'saksfifthavenue.com',
  'neimanmarcus.com',
  'harrods.com',
  'selfridges.com',
  'fragrantica.com',
  'parfumo.com'
)

$overrides = @{
  'ysl-black-opium' = @{
    pageUrl = 'https://www.sephora.it/p/black-opium---eau-de-parfum-306748.html'
    imageUrl = 'https://media.sephora.eu/content/dam/digital/pim/published/Y/YVES_SAINT_LAURENT/P1920022/23512-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit'
  }
  'prada-paradoxe' = @{
    pageUrl = 'https://www.prada.com/us/en/p/paradoxe-edp-90-ml/1A1351_2HDZ_F0Z99_P_ML090'
    imageUrl = 'https://www.prada.com/content/dam/pradabkg_products/1/1A1/1A1351/2HDZF0Z99/1A1351_2HDZ_F0Z99_P_ML090_SLF.jpg'
  }
  'zoologist-panda' = @{
    pageUrl = 'https://www.zoologistperfumes.com/products/panda'
    imageUrl = 'https://www.zoologistperfumes.com/cdn/shop/files/Bottle-Front-Panda_600x.jpg?v=1772388281'
  }
  'replica-on-a-date' = @{
    pageUrl = 'https://www.maisonmargiela-fragrances.eu/en_GB/fragrances/discover/replica-memories/replica-on-a-date/MM016.html'
    imageUrl = 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwcfcb439e/images/products/MM016/MM016_MAIN.jpg'
  }
  'mfk-a-la-rose' = @{
    pageUrl = 'https://www.franciskurkdjian.com/us-en/p/a-la-rose-eau-de-parfum-RA12241.html'
    imageUrl = 'https://www.franciskurkdjian.com/dw/image/v2/BJSB_PRD/on/demandware.static/-/Sites-mfk-master-catalog/default/dw2ddda9d3/A_LA_ROSE/FRAGRANCE/3700559612255_A_LA_ROSE_EDP_70ML_1.png?sw=1600&sh=1600&sfrm=png&q=85&strip=true'
  }
  'replica-dancing-on-the-moon' = @{
    pageUrl = 'https://www.maisonmargiela-fragrances.eu/en_GB/replica-dancing-on-the-moon/MM153.html'
    imageUrl = 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwb2bea881/images/products/MM153/1_2000x2000.jpg'
  }
  'replica-ideal-one' = @{
    pageUrl = 'https://www.maisonmargiela-fragrances.eu/en_GB/fragrances/discover/replica-memories/replica-ideal-one/MM164.html'
    imageUrl = 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwb5a2544d/images/products/MM164/1.jpg'
  }
  'billie-eilish-eilish' = @{
    pageUrl = 'https://www.ulta.com/p/eilish-eau-de-parfum-pimprod2030620'
    imageUrl = 'https://media.ulta.com/i/ulta/2594570?w=1080&h=1080&fmt=auto'
  }
  'narciso-rodriguez-for-her' = @{
    pageUrl = 'https://www.narcisorodriguezparfums.com/en/narciso-rodriguez-for-her/for-her-edt.html'
    imageUrl = 'https://www.narcisorodriguezparfums.com/dw/image/v2/BCMQ_PRD/on/demandware.static/-/Sites-itemmaster_narcisorodriguez/default/dw9b9df683/for-her-edt/narciso-rodriguez-for-her-eau-de-toilette-perfume-100ml.png?sw=800&sh=900&sm=fit&q=100'
  }
  'terre-hermes' = @{
    pageUrl = 'https://www.hermes.com/es/es/product/terre-d-hermes-eau-de-toilette-V107188V0/'
    imageUrl = 'https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw5b0bf162/images/hi-res-BR/3346131400003_1500px.jpg?sw=1200&sh=1200&sm=fit'
  }
  'boss-bottled' = @{
    pageUrl = 'https://www.sephora.it/p/boss-bottled---eau-de-toilette-794299.html'
    imageUrl = 'https://media.sephora.eu/content/dam/digital/pim/published/H/HUGO_BOSS/P2384/18656-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit'
  }
  'lattafa-yara' = @{
    pageUrl = 'https://beautyhouse.com/products/lattafa-yara-eau-de-parfum-for-women'
    imageUrl = 'https://beautyhouse.com/cdn/shop/files/01jokedobc_8189428f-39e0-4267-ac2c-759892ceff6a.png?v=1759859282&width=1600'
  }
  'bleu-chanel' = @{
    pageUrl = 'https://www.chanel.com/gb/fragrance/p/107360/bleu-de-chanel-eau-de-parfum-spray/'
    imageUrl = 'https://www.chanel.com/emea/img/prd-emea/sys-master/content/h04/hc7/9250236170270'
  }
  'black-orchid' = @{
    pageUrl = 'https://www.sephora.it/p/black-orchid---eau-de-parfum-P55019.html'
    imageUrl = 'https://media.sephora.eu/content/dam/digital/pim/published/T/TOM%20FORD/P55019/12325-media_5.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit'
    thumbnailUrl = 'https://thfvnext.bing.com/th/id/OIP.j2Ky0ycnbiJw4uiN1a2FnQHaHa?cb=thfvnextfalcon2&pid=Api'
  }
  'libre-ysl' = @{
    pageUrl = 'https://www.sephora.fr/p/libre---eau-de-parfum-P3800005.html'
    imageUrl = 'https://www.sephora.fr/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dw450b9fcc/images/hi-res/alternates/PID_alternate1/PID_alternate1_1/P3800005_1.jpg'
    thumbnailUrl = 'https://tse4.mm.bing.net/th/id/OIP.A7AniKKNMuU9_IqL0Z2N3QHaHa?pid=Api'
  }
  'chance-chanel' = @{
    pageUrl = 'https://www.chanel.com/gb/fragrance/p/126260/chance-eau-tendre-eau-de-parfum-spray/'
    imageUrl = 'https://www.chanel.com/images/t_one/t_fragrance/q_auto:good,f_auto,fl_lossy,dpr_1.1/w_1920/chance-eau-tendre-eau-de-parfum-spray-3-4fl-oz--packshot-default-126260-9564866838558.jpg'
  }
  'acqua-armani' = @{
    pageUrl = 'https://www.sephora.fr/p/acqua-di-gio-pour-homme---eau-de-toilette-18359.html'
    imageUrl = 'https://www.sephora.fr/on/demandware.static/-/Sites-masterCatalog_Sephora/default/dw69aca628/images/hi-res/alternates/PID_alternate1/PID_alternate1_528/P2277_1.jpg'
    thumbnailUrl = 'https://tse2.mm.bing.net/th/id/OIP.fMIGrWZso6ohFAS5zjC4ogHaHa?pid=Api'
  }
  'la-vie-est-belle' = @{
    pageUrl = 'https://www.sephora.pt/p/la-vie-est-belle---eau-de-parfum-P1067011.html'
    imageUrl = 'https://media.sephora.eu/content/dam/digital/pim/published/L/LANC%C3%94ME/P1067011/1294-media_5.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit'
    thumbnailUrl = 'https://tse2.mm.bing.net/th/id/OIP.dyTtjr1Z0IEjdIQxIzQ5qgHaHa?pid=Api'
  }
  'si-armani' = @{
    pageUrl = 'https://www.sephora.com.au/products/armani-beauty-si-passione-eau-de-parfum'
    imageUrl = 'https://image-optimizer-reg.production.sephora-asia.net/images/product_images/closeup_2_Product_3614271994844-Giorgio-Armani-Si-Passione-Eau-De-Pa_42961ab740586ddbd636aa3bdf00f58409d65155_1732509599.png'
  }
  'black-phantom-kilian' = @{
    pageUrl = 'https://www.sephora.fr/p/black-phantom--memento-mori----eau-de-parfum-P4003088.html'
    imageUrl = 'https://media.sephora.eu/content/dam/digital/pim/published/K/KILIAN_PARIS/P4003088/51023-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit'
    thumbnailUrl = 'https://tse2.mm.bing.net/th/id/OIP.JdOEUa9zWqLOWmksNAODbQHaHa?pid=Api'
  }
  'versace-bright-crystal' = @{
    pageUrl = 'https://www.sephora.com.au/products/versace-bright-crystal-eau-de-toilette'
    imageUrl = 'https://image-optimizer-reg.production.sephora-asia.net/images/product_images/zoom_1_Product_183200_20Versace_20Bright_20Crystal_20EDT_2090ml_acd6b10792d760ecc74117744dca014640d23427_1528361435.png'
  }
  'replica-lazy-sunday-morning' = @{
    pageUrl = 'https://www.maisonmargiela.com/de-de/replica-lazy-sunday-morning-eau-de-toilette-S33YX0018S10932001.html'
    imageUrl = 'https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwd5bce2b7/images/large/S33YX0018_S10932_001_F.jpg?sw=1024&q=80'
  }
  'tobacco-vanille-tf' = @{
    pageUrl = 'https://www.neimanmarcus.com/p/tom-ford-tobacco-vanille-eau-de-parfum-1-oz-30-ml-prod230340327'
    imageUrl = 'https://images.neimanmarcus.com/ca/1/product_assets/C/5/4/Z/U/NMC54ZU_mz.jpg'
  }
  'replica-jazz-club' = @{
    pageUrl = 'https://www.maisonmargiela.com/de-de/replica-jazz-club-eau-de-toilette-S33YX0016S10930001.html'
    imageUrl = 'https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dw4b01e89f/images/large/S33YX0016_S10930_001_F.jpg?sw=1024&q=80'
  }
}

$workspace = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $workspace 'public\images\products'
$manifestPath = Join-Path $workspace 'public\images\products\sources.json'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$existingResults = if (Test-Path $manifestPath) {
  @(Get-Content -Raw $manifestPath | ConvertFrom-Json)
} else {
  @()
}
$existingById = @{}
$existingResults | ForEach-Object { $existingById[$_.id] = $_ }
$itemsToProcess = if ($OnlyMissing) {
  @($items | Where-Object {
    -not $existingById.ContainsKey($_.id) -or
    $existingById[$_.id].status -ne 'OK' -or
    -not (Test-Path (Join-Path $outputDirectory $existingById[$_.id].file))
  })
} else {
  $items
}

function Get-ImageCandidates {
  param([string]$Query)

  $encodedQuery = [uri]::EscapeDataString($Query)
  $html = (Invoke-WebRequest `
    -Uri "https://duckduckgo.com/?q=$encodedQuery" `
    -UseBasicParsing `
    -Headers @{ 'User-Agent' = 'Mozilla/5.0' }).Content
  $tokenMatch = [regex]::Match($html, 'vqd=["'']?([\d-]+)')
  if (-not $tokenMatch.Success) {
    return @()
  }

  $response = Invoke-RestMethod `
    -Uri "https://duckduckgo.com/i.js?l=us-en&o=json&q=$encodedQuery&vqd=$($tokenMatch.Groups[1].Value)&f=,,,,,&p=1" `
    -Headers @{
      'User-Agent' = 'Mozilla/5.0'
      'Referer' = 'https://duckduckgo.com/'
    }

  $response.results | ForEach-Object {
    [pscustomobject]@{
      purl = $_.url
      murl = $_.image
      turl = $_.thumbnail
    }
  } | Where-Object { $_.murl -and $_.purl }
}

function Test-TrustedHost {
  param(
    [string]$Url,
    [string[]]$Domains
  )

  try {
    $hostName = ([uri]$Url).Host.ToLowerInvariant()
    return [bool]($Domains | Where-Object {
      $hostName -eq $_ -or $hostName.EndsWith(".$_")
    })
  } catch {
    return $false
  }
}

function Save-StandardProductImage {
  param(
    [string]$SourcePath,
    [string]$DestinationPath
  )

  Add-Type -AssemblyName System.Drawing
  $sourceImage = [System.Drawing.Image]::FromFile($SourcePath)
  try {
    $canvasSize = 900
    $padding = 45
    $availableSize = $canvasSize - ($padding * 2)
    $scale = [math]::Min($availableSize / $sourceImage.Width, $availableSize / $sourceImage.Height)
    $width = [int]($sourceImage.Width * $scale)
    $height = [int]($sourceImage.Height * $scale)
    $x = [int](($canvasSize - $width) / 2)
    $y = [int](($canvasSize - $height) / 2)

    $bitmap = New-Object System.Drawing.Bitmap($canvasSize, $canvasSize)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($sourceImage, $x, $y, $width, $height)
      } finally {
        $graphics.Dispose()
      }

      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object MimeType -eq 'image/jpeg'
      $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      try {
        $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
          [System.Drawing.Imaging.Encoder]::Quality,
          90L
        )
        $bitmap.Save($DestinationPath, $jpegCodec, $encoderParameters)
      } finally {
        $encoderParameters.Dispose()
      }
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $sourceImage.Dispose()
  }
}

$newResults = foreach ($item in $itemsToProcess) {
  $allowedDomains = @($item.domain) + $trustedRetailers
  $isOverride = $overrides.ContainsKey($item.id)
  if ($isOverride) {
    $candidate = [pscustomobject]@{
      purl = $overrides[$item.id].pageUrl
      murl = $overrides[$item.id].imageUrl
      turl = $overrides[$item.id].thumbnailUrl
    }
  } else {
    $candidates = Get-ImageCandidates "$($item.query) official product bottle white background"
    $candidate = $candidates | Where-Object {
      (Test-TrustedHost $_.purl $allowedDomains) -or
      (Test-TrustedHost $_.murl $allowedDomains)
    } | Select-Object -First 1

    if (-not $candidate) {
      $candidates = Get-ImageCandidates "$($item.query) Sephora product bottle"
      $candidate = $candidates | Where-Object {
        (Test-TrustedHost $_.purl $allowedDomains) -or
        (Test-TrustedHost $_.murl $allowedDomains)
      } | Select-Object -First 1
    }
  }

  if (-not $candidate) {
    [pscustomobject]@{
      id = $item.id
      status = 'NO_TRUSTED_RESULT'
      pageUrl = ''
      imageSourceUrl = ''
      file = ''
    }
    continue
  }

  $extension = [IO.Path]::GetExtension(([uri]$candidate.murl).AbsolutePath).ToLowerInvariant()
  if ($extension -notin @('.jpg', '.jpeg', '.png', '.webp')) {
    $extension = '.jpg'
  }

  $downloadPath = Join-Path $outputDirectory "$($item.id).download$extension"
  $fileName = "$($item.id).jpg"
  $filePath = Join-Path $outputDirectory $fileName

  try {
    try {
      Invoke-WebRequest `
        -Uri $candidate.murl `
        -OutFile $downloadPath `
        -UseBasicParsing `
        -Headers @{
          'User-Agent' = 'Mozilla/5.0'
          'Referer' = $candidate.purl
        }
    } catch {
      if (-not $candidate.turl) {
        throw
      }
      Invoke-WebRequest `
        -Uri $candidate.turl `
        -OutFile $downloadPath `
        -UseBasicParsing `
        -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
    }

    if ((Get-Item $downloadPath).Length -lt 5000) {
      throw 'Downloaded file is unexpectedly small.'
    }

    $normalizedPath = "$filePath.normalized"
    Save-StandardProductImage -SourcePath $downloadPath -DestinationPath $normalizedPath
    Move-Item -LiteralPath $normalizedPath -Destination $filePath -Force
    Remove-Item -LiteralPath $downloadPath -Force
    $sourcePageUrl = if ($isOverride -or (Test-TrustedHost $candidate.purl $allowedDomains)) {
      $candidate.purl
    } else {
      "https://$(([uri]$candidate.murl).Host)/"
    }

    [pscustomobject]@{
      id = $item.id
      status = 'OK'
      pageUrl = $sourcePageUrl
      imageSourceUrl = $candidate.murl
      file = $fileName
    }
  } catch {
    Remove-Item -LiteralPath $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath "$filePath.normalized" -Force -ErrorAction SilentlyContinue
    [pscustomobject]@{
      id = $item.id
      status = "FAILED: $($_.Exception.Message)"
      pageUrl = $candidate.purl
      imageSourceUrl = $candidate.murl
      file = ''
    }
  }

  Start-Sleep -Milliseconds 300
}

$newById = @{}
$newResults | ForEach-Object { $newById[$_.id] = $_ }
$results = foreach ($item in $items) {
  if ($newById.ContainsKey($item.id)) {
    $newById[$item.id]
  } elseif ($existingById.ContainsKey($item.id)) {
    $existingById[$item.id]
  }
}

$manifestJson = $results | ConvertTo-Json -Depth 4
[IO.File]::WriteAllText($manifestPath, $manifestJson, (New-Object Text.UTF8Encoding($false)))
$results | Format-Table -AutoSize id, status, file, pageUrl
