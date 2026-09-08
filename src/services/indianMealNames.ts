/**
 * Indian Meal Naming Engine
 *
 * Converts scientific, botanical, Latin, sterile English descriptive phrases,
 * vegetable/ingredient combinations, or generic labels into authentic, everyday
 * Indian meal names across North, South, East, West, and Central India.
 */

export interface IngredientInput {
  name: string;
  weightGrams?: number;
}

// 1. Scientific & Botanical Latin Terms -> Everyday Indian Names
const SCIENTIFIC_TO_INDIAN_MAP: Array<{ pattern: RegExp; indian: string }> = [
  // Lentils & Pulses
  { pattern: /\b(lens culinaris|lens esculenta)\b/gi, indian: 'Dal' },
  { pattern: /\b(cicer arietinum)\b/gi, indian: 'Chole' },
  { pattern: /\b(phaseolus vulgaris)\b/gi, indian: 'Rajma' },
  { pattern: /\b(vigna radiata|phaseolus aureus)\b/gi, indian: 'Moong Dal' },
  { pattern: /\b(vigna mungo|phaseolus mungo)\b/gi, indian: 'Urad Dal' },
  { pattern: /\b(cajanus cajan|cajanus indicus)\b/gi, indian: 'Toor Dal' },
  { pattern: /\b(pisum sativum)\b/gi, indian: 'Matar' },
  { pattern: /\b(vigna unguiculata)\b/gi, indian: 'Lobia' },

  // Grains & Flours
  { pattern: /\b(oryza sativa)\b/gi, indian: 'Chawal' },
  { pattern: /\b(triticum aestivum|triticum durum)\b/gi, indian: 'Roti' },
  { pattern: /\b(pennisetum glaucum)\b/gi, indian: 'Bajra' },
  { pattern: /\b(sorghum bicolor)\b/gi, indian: 'Jowar' },
  { pattern: /\b(eleusine coracana)\b/gi, indian: 'Ragi' },
  { pattern: /\b(zea mays)\b/gi, indian: 'Makki' },

  // Vegetables
  { pattern: /\b(solanum tuberosum)\b/gi, indian: 'Aloo' },
  { pattern: /\bbrassica oleracea(\s+var\.?\s+\w+)?\b/gi, indian: 'Gobi' },
  { pattern: /\b(spinacia oleracea)\b/gi, indian: 'Palak' },
  { pattern: /\b(abelmoschus esculentus|hibiscus esculentus)\b/gi, indian: 'Bhindi' },
  { pattern: /\b(solanum melongena)\b/gi, indian: 'Baingan' },
  { pattern: /\b(solanum lycopersicum|lycopersicon esculentum)\b/gi, indian: 'Tamatar' },
  { pattern: /\b(capsicum annuum|capsicum frutescens)\b/gi, indian: 'Shimla Mirch' },
  { pattern: /\b(allium cepa)\b/gi, indian: 'Pyaz' },
  { pattern: /\b(allium sativum)\b/gi, indian: 'Lehsun' },
  { pattern: /\b(zingiber officinale)\b/gi, indian: 'Adrak' },
  { pattern: /\b(daucus carota)\b/gi, indian: 'Gajar' },
  { pattern: /\b(raphanus sativus)\b/gi, indian: 'Mooli' },
  { pattern: /\b(momordica charantia)\b/gi, indian: 'Karela' },
  { pattern: /\b(lagenaria siceraria)\b/gi, indian: 'Lauki' },
  { pattern: /\b(luffa acutangula|luffa aegyptiaca)\b/gi, indian: 'Turai' },
  { pattern: /\b(trichosanthes dioica)\b/gi, indian: 'Parwal' },
  { pattern: /\b(colocasia esculenta)\b/gi, indian: 'Arbi' },
  { pattern: /\b(moringa oleifera)\b/gi, indian: 'Sahjan (Drumstick)' },
  { pattern: /\b(trigonella foenum-graecum)\b/gi, indian: 'Methi' },
  { pattern: /\b(coriandrum sativum)\b/gi, indian: 'Dhania' },
  { pattern: /\b(mentha spicata|mentha piperita)\b/gi, indian: 'Pudina' },
  { pattern: /\b(curcuma longa)\b/gi, indian: 'Haldi' },
  { pattern: /\b(cuminum cyminum)\b/gi, indian: 'Jeera' },
  { pattern: /\b(sesamum indicum)\b/gi, indian: 'Til' },
  { pattern: /\b(brassica juncea|brassica nigra)\b/gi, indian: 'Sarson' },

  // Dairy, Meats & Fish
  { pattern: /\b(gallus gallus domesticus|gallus gallus)\b/gi, indian: 'Chicken' },
  { pattern: /\b(capra hircus|ovis aries)\b/gi, indian: 'Mutton' },
  { pattern: /\b(bos taurus|bubalus bubalis)\b/gi, indian: 'Paneer' },
  { pattern: /\b(labeo rohita)\b/gi, indian: 'Rohu Fish' },
  { pattern: /\b(tenualosa ilisha)\b/gi, indian: 'Ilish Fish' },
];

/**
 * Normalizes input text by replacing Latin/scientific botanical names with everyday Indian ingredient names.
 */
export function replaceScientificNames(text: string): string {
  if (!text) return '';
  let result = text;
  for (const { pattern, indian } of SCIENTIFIC_TO_INDIAN_MAP) {
    result = result.replace(pattern, indian);
  }
  return result;
}

/**
 * Checks if a string contains any scientific/botanical Latin terms.
 */
export function containsScientificTerms(text: string): boolean {
  if (!text) return false;
  return SCIENTIFIC_TO_INDIAN_MAP.some(({ pattern }) => pattern.test(text));
}

/**
 * Detects key vegetables and ingredients present in text or ingredient list.
 */
export function detectVegetablesAndIngredients(
  input: string | IngredientInput[]
): Array<{ name: string; category: string }> {
  const text = typeof input === 'string' 
    ? input.toLowerCase() 
    : input.map(i => i.name.toLowerCase()).join(' ');

  const detected: Array<{ name: string; category: string }> = [];
  const addIfPresent = (regex: RegExp, name: string, category: string) => {
    if (regex.test(text) && !detected.some(d => d.name === name)) {
      detected.push({ name, category });
    }
  };

  // Vegetables
  addIfPresent(/\b(aloo|potato|solanum tuberosum|alu)\b/i, 'Aloo (Potato)', 'Vegetable');
  addIfPresent(/\b(gobi|cauliflower|gobhi|phool gobi)\b/i, 'Gobi (Cauliflower)', 'Vegetable');
  addIfPresent(/\b(palak|spinach|saag)\b/i, 'Palak (Spinach)', 'Vegetable');
  addIfPresent(/\b(bhindi|okra|lady\s*finger)\b/i, 'Bhindi (Okra)', 'Vegetable');
  addIfPresent(/\b(baingan|eggplant|aubergine|brinjal)\b/i, 'Baingan (Eggplant)', 'Vegetable');
  addIfPresent(/\b(tamatar|tomato)\b/i, 'Tamatar (Tomato)', 'Vegetable');
  addIfPresent(/\b(pyaz|onion|kanda)\b/i, 'Pyaz (Onion)', 'Vegetable');
  addIfPresent(/\b(matar|mutter|green\s*peas?|pea)\b/i, 'Matar (Green Peas)', 'Vegetable');
  addIfPresent(/\b(shimla\s*mirch|capsicum|bell\s*pepper)\b/i, 'Shimla Mirch (Capsicum)', 'Vegetable');
  addIfPresent(/\b(gajar|carrot)\b/i, 'Gajar (Carrot)', 'Vegetable');
  addIfPresent(/\b(methi|fenugreek)\b/i, 'Methi (Fenugreek)', 'Vegetable');
  addIfPresent(/\b(sarson|mustard\s*greens)\b/i, 'Sarson (Mustard Greens)', 'Vegetable');
  addIfPresent(/\b(karela|bitter\s*gourd)\b/i, 'Karela (Bitter Gourd)', 'Vegetable');
  addIfPresent(/\b(lauki|bottle\s*gourd|dudhi|ghiya)\b/i, 'Lauki (Bottle Gourd)', 'Vegetable');
  addIfPresent(/\b(turai|tori|ridge\s*gourd)\b/i, 'Turai (Ridge Gourd)', 'Vegetable');
  addIfPresent(/\b(sahjan|drumstick)\b/i, 'Sahjan (Drumstick)', 'Vegetable');
  addIfPresent(/\b(arbi|colocasia|taro)\b/i, 'Arbi (Colocasia)', 'Vegetable');

  // Pulses & Grains
  addIfPresent(/\b(dal|toor|moong|urad|masoor|lentil|chana\s*dal)\b/i, 'Dal (Lentil)', 'Pulse');
  addIfPresent(/\b(rajma|kidney\s*bean)\b/i, 'Rajma (Kidney Beans)', 'Pulse');
  addIfPresent(/\b(chole|chana|chickpea|garbanzo)\b/i, 'Chole (Chickpeas)', 'Pulse');
  addIfPresent(/\b(roti|chapati|phulka|wheat|atta)\b/i, 'Whole Wheat Roti', 'Grain');
  addIfPresent(/\b(chawal|rice|basmati)\b/i, 'Basmati Rice', 'Grain');
  addIfPresent(/\b(poha|flattened\s*rice)\b/i, 'Poha (Flattened Rice)', 'Grain');

  // Dairy & Meats
  addIfPresent(/\b(paneer|cottage\s*cheese)\b/i, 'Paneer (Cottage Cheese)', 'Dairy');
  addIfPresent(/\b(dahi|curd|yogurt|raita)\b/i, 'Dahi (Curd)', 'Dairy');
  addIfPresent(/\b(chicken|murgh)\b/i, 'Chicken', 'Meat');
  addIfPresent(/\b(mutton|goat|lamb|keema)\b/i, 'Mutton', 'Meat');
  addIfPresent(/\b(egg|anda)\b/i, 'Egg', 'Protein');
  addIfPresent(/\b(fish|mach|macher|pomfret|rohu|katla|ilish)\b/i, 'Fish', 'Seafood');

  return detected;
}

/**
 * Checks if the text semantically matches specific dish signatures across all Indian regions.
 */
function matchSemanticIndianDish(text: string): string | null {
  const t = text.toLowerCase();

  // Grand Thali check: Roti + Rice + Dal + Sabzi
  const hasRoti = /\b(roti|chapati|phulka|flatbread|paratha|naan)\b/i.test(t);
  const hasRice = /\b(rice|chawal|basmati)\b/i.test(t);
  const hasDal = /\b(dal|lentil|toor|moong|urad|masoor|sambar)\b/i.test(t);
  const hasSabzi = /\b(sabzi|curry|aloo|gobi|bhindi|baingan|palak|spinach|paneer|matar|mutter|pea|vegetable)\b/i.test(t);

  if (hasRoti && hasRice && hasDal && hasSabzi) {
    return 'North Indian Thali (Roti, Dal Tadka, Sabzi & Jeera Rice)';
  }

  // ==================== REGIONAL SPECIALTIES ====================

  // Sarson Ka Saag with Makki Di Roti
  if (/\b(sarson|mustard\s*greens)\b/i.test(t) && /\b(makki|corn|maize|saag)\b/i.test(t)) {
    return 'Sarson Ka Saag with Makki Di Roti';
  }

  // Rajasthani
  if (/\b(dal\s*baati|baati\s*churma|dal\s*bati)\b/i.test(t)) {
    return 'Dal Baati Churma with Ghee';
  }
  if (/\b(gatte\s*ki\s*sabzi|gatta\s*curry|gram\s*flour\s*dumpling.*yogurt)\b/i.test(t)) {
    return 'Gatte Ki Sabzi with Bajra Roti';
  }
  if (/\b(laal\s*maas|rajasthani\s*mutton)\b/i.test(t)) {
    return 'Rajasthani Laal Maas with Bajra Roti';
  }

  // Maharashtrian
  if (/\b(misal\s*pav|sprouted.*(moth|bean).*(bread|pav)s?|tarri.*pav)\b/i.test(t)) {
    return 'Misal Pav with Farsan & Lemon';
  }
  if (/\b(pav\s*bhaji|mashed.*veg.*(bread|roll|bun|pav)s?)\b/i.test(t)) {
    return 'Pav Bhaji with Buttered Pav';
  }
  if (/\b(vada\s*pav|wada\s*pav|potato.*dumpling.*(bread|bun|roll)s?|batata\s*vada.*pav)\b/i.test(t)) {
    return 'Vada Pav with Chutneys';
  }
  if (/\b(sabudana\s*khichdi|tapioca.*(peanut|potato))\b/i.test(t)) {
    return 'Sabudana Khichdi with Roasted Peanuts';
  }
  if (/\b(thalipeeth|multigrain.*pancake|bhajani.*thalipeeth)\b/i.test(t)) {
    return 'Thalipeeth with Dahi & White Butter';
  }
  if (/\b(pithla|pitla|zunka)\b/i.test(t) && /\b(bhakri|bhakar|roti)\b/i.test(t)) {
    return 'Pithla Bhakri with Thecha';
  }
  if (/\b(kanda\s*poha|batata\s*poha|poha|flattened\s*rice|beaten\s*rice)\b/i.test(t)) {
    return 'Kanda Poha with Peanuts';
  }

  // Gujarati
  if (/\b(dhokla|khaman|fermented.*gram\s*flour.*cake|steamed.*chickpea.*sponge)\b/i.test(t)) {
    return 'Khaman Dhokla with Green Chutney';
  }
  if (/\b(thepla|methi\s*thepla|fenugreek.*flatbread)\b/i.test(t)) {
    return 'Methi Thepla with Dahi & Chhundo';
  }
  if (/\b(khandvi|gram\s*flour.*rolls?)\b/i.test(t)) {
    return 'Khandvi with Mustard Tempering';
  }
  if (/\b(dal\s*dhokli|wheat\s*pasta.*lentil|spiced.*lentil.*dumpling)\b/i.test(t)) {
    return 'Gujarati Dal Dhokli';
  }
  if (/\b(sev\s*tameta|sev\s*tamatar|tomato.*sev)\b/i.test(t)) {
    return 'Sev Tameta Nu Shaak with Phulka';
  }
  if (/\b(undhiyu|mixed\s*vegetable.*casserole)\b/i.test(t)) {
    return 'Gujarati Undhiyu with Puri';
  }

  // Bengali & East Indian
  if (/\b(macher\s*jhol|bengali.*fish\s*curry|rohu.*curry|fish.*curry.*mustard\s*oil)\b/i.test(t)) {
    return 'Macher Jhol with Steamed Rice';
  }
  if (/\b(kosha\s*mangsho|bengali.*mutton|spicy.*mutton.*luchi)\b/i.test(t)) {
    return 'Kosha Mangsho with Luchi';
  }
  if (/\b(shorshe\s*ilish|hilsa.*mustard|mustard.*fish.*bengali)\b/i.test(t)) {
    return 'Shorshe Ilish with Steamed Rice';
  }
  if (/\b(chingri\s*malai|prawn.*coconut.*curry)\b/i.test(t)) {
    return 'Chingri Malai Curry with Basmati Rice';
  }
  if (/\b(luchi)\b/i.test(t) && /\b(alur\s*dom|aloo\s*dum|dum\s*aloo)\b/i.test(t)) {
    return 'Luchi with Alur Dom';
  }
  if (/\b(dalma|odia.*dalma|lentil.*raw\s*papaya)\b/i.test(t)) {
    return 'Dalma with Steamed Rice';
  }
  if (/\b(litti\s*chokha|sattu.*baati|bihari.*litti)\b/i.test(t)) {
    return 'Litti Chokha with Desi Ghee';
  }
  if (/\b(sattu\s*paratha|sattu.*roti)\b/i.test(t)) {
    return 'Sattu Paratha with Baingan Bharta';
  }

  // Himalayan / North-East
  if (/\b(momos?|steamed.*(dumpling|dimsum)s?.*spicy\s*chutney)\b/i.test(t)) {
    return 'Momos with Spicy Red Garlic Chutney';
  }
  if (/\b(thukpa|tibetan.*noodle|himalayan.*noodle\s*soup)\b/i.test(t)) {
    return 'Thukpa (Tibetan / Himalayan Noodle Soup)';
  }

  // Kadhi Chawal (Check before Curd Rice)
  if (/\b(kadhi\s*pakora|kadhi\s*chawal|punjabi\s*kadhi|gram\s*flour.*(pakora|fritter).*curry|gram\s*flour.*curry.*rice)\b/i.test(t)) {
    return 'Kadhi Pakora with Steamed Rice';
  }

  // South Indian
  if (/\b(uttapam|rice.*lentil.*pancake|onion\s*uttapam|fermented.*pancake)\b/i.test(t)) {
    return 'Uttapam with Sambar & Chutney';
  }
  if (/\b(idli|steamed.*(rice|lentil).*(cake|dumpling)s?|fermented.*(rice|lentil).*(cake|dumpling)s?)\b/i.test(t)) {
    return 'Idli Sambar with Coconut Chutney';
  }
  if (/\b(masala\s*dosa|crisp.*crepe.*potato|dosa.*potato|ghee\s*roast.*dosa)\b/i.test(t)) {
    return 'Masala Dosa with Sambar & Chutney';
  }
  if (/\b(dosa|crepe)\b/i.test(t) && !/\b(masala)\b/i.test(t)) {
    return 'Masala Dosa with Sambar & Chutney';
  }
  if (/\b(medu\s*vada|vadai|wada|fried.*lentil.*(donut|fritter|dumpling)s?|lentil\s*donuts?|sambar\s*vada)\b/i.test(t)) {
    return 'Medu Vada with Sambar';
  }
  if (/\b(pongal|ven\s*pongal|ghee\s*pongal|rice.*moong.*peppercorn)\b/i.test(t)) {
    return 'Ven Pongal with Coconut Chutney';
  }
  if (/\b(upma|semolina\s*porridge|rava\s*upma)\b/i.test(t)) {
    return 'Veg Upma with Coconut Chutney';
  }
  if (/\b(curd\s*rice|thayir\s*sadam|yogurt.*rice|daddojanam)\b/i.test(t)) {
    return 'Curd Rice with Tadka';
  }
  if (/\b(lemon\s*rice|chitranna|elumichai\s*sadam)\b/i.test(t)) {
    return 'South Indian Lemon Rice (Chitranna)';
  }
  if (/\b(bisi\s*bele\s*bath|bisibelebath|karnataka.*sambar\s*rice)\b/i.test(t)) {
    return 'Bisi Bele Bath with Boondi';
  }
  if (/\b(avial|kerala\s*avial|mixed\s*vegetables.*curd.*coconut)\b/i.test(t)) {
    return 'Avial with Steamed Rice';
  }
  if (/\b(appam)\b/i.test(t) && /\b(stew|coconut\s*milk)\b/i.test(t)) {
    return 'Appam with Vegetable Stew';
  }
  if (/\b(puttu)\b/i.test(t) && /\b(kadala|black\s*chickpea)\b/i.test(t)) {
    return 'Puttu with Kadala Curry';
  }
  if (/\b(chettinad.*chicken|spicy.*chettinad)\b/i.test(t)) {
    return 'Chettinad Chicken Curry with Rice';
  }
  if (/\b(rasam)\b/i.test(t)) {
    return 'Rasam with Steamed Rice';
  }
  if (/\b(sambar)\b/i.test(t) && !/\b(idli|dosa|vada|uttapam)\b/i.test(t)) {
    return 'Sambar with Steamed Rice';
  }

  // Chaats & Street Food
  if (/\b(pani\s*puri|gol\s*gappe|puchka|hollow.*(puri|mint)|(crisp|hollow).*mint.*water)\b/i.test(t)) {
    return 'Pani Puri (Gol Gappe / Puchka)';
  }
  if (/\b(bhel\s*puri|puffed\s*rice.*chutney|sukha\s*bhel)\b/i.test(t)) {
    return 'Bhel Puri with Sev & Chutneys';
  }
  if (/\b(sev\s*puri|puri.*sev|sev.*puri)\b/i.test(t)) {
    return 'Sev Puri';
  }
  if (/\b(aloo\s*tikki|potato.*patt.*(curd|chutney)|tikki\s*chaat)\b/i.test(t)) {
    return 'Aloo Tikki Chaat with Dahi & Chutneys';
  }
  if (/\b(samosa\s*chaat)\b/i.test(t)) {
    return 'Samosa Chaat with Chole & Dahi';
  }
  if (/\b(samosa|triangular.*pastr(y|ies)|potato.*pastr(y|ies))\b/i.test(t)) {
    return 'Samosa with Mint Chutney';
  }
  if (/\b(dahi\s*puri|dahi\s*bhalla|dahi\s*vada)\b/i.test(t)) {
    return 'Dahi Puri / Dahi Bhalla Chaat';
  }
  if (/\b(kathi\s*roll|frankie)\b/i.test(t)) {
    if (/\b(chicken)\b/i.test(t)) return 'Chicken Kathi Roll';
    if (/\b(paneer)\b/i.test(t)) return 'Paneer Tikka Kathi Roll';
    return 'Egg Kathi Roll';
  }

  // Kadhi Chawal
  if (/\b(kadhi\s*pakora|kadhi\s*chawal|punjabi\s*kadhi|gram\s*flour.*yogurt.*fritters?)\b/i.test(t)) {
    return 'Kadhi Pakora with Steamed Rice';
  }

  // Egg Dishes
  if (/\b(egg.*bhurji|anda\s*bhurji|scrambled\s*eggs?|egg.*scramble)\b/i.test(t)) {
    return hasRoti ? 'Egg Bhurji with Whole Wheat Roti' : 'Egg Bhurji with Pav';
  }
  if (/\b(egg\s*curry|anda\s*curry|boiled\s*egg.*curry)\b/i.test(t)) {
    return 'Egg Curry with Steamed Rice';
  }
  if (/\b(boiled\s*eggs?)\b/i.test(t)) {
    return 'Boiled Eggs with Chaat Masala (3 Eggs)';
  }

  // Chole (Chickpeas) Combos
  if (/\b(chole|chana|chickpea|garbanzo)\b/i.test(t)) {
    if (/\b(bhatur[ae]?|fried.*bread|puffed.*bread|leavened.*bread|puri|poori)\b/i.test(t)) {
      return 'Chole Bhature with Pickled Onions';
    }
    if (/\b(rice|chawal|basmati)\b/i.test(t)) {
      return 'Chole Chawal';
    }
    if (/\b(kulcha)\b/i.test(t)) {
      return 'Chole Kulche';
    }
    return 'Chole Masala with Roti';
  }

  // Rajma (Kidney Beans) Combos
  if (/\b(rajma|kidney\s*bean)\b/i.test(t)) {
    if (/\b(rice|chawal|basmati|grain)\b/i.test(t)) {
      return 'Rajma Chawal';
    }
    return 'Rajma Masala with Roti';
  }

  // Sprouted Moong / Chaats
  if (/\b(sprout|sprouted)\b/i.test(t)) {
    if (/\b(moong|mung|bean)\b/i.test(t)) return 'Sprouted Moong Chaat with Lemon';
    if (/\b(chana|chickpea)\b/i.test(t)) return 'Sprouted Chana Chaat';
    return 'Sprouted Moong Chaat with Lemon';
  }

  // Dal / Lentils Combos
  if (/\b(dal\s*makhani|black\s*lentil.*(butter|cream))\b/i.test(t)) {
    return 'Dal Makhani with Jeera Rice';
  }
  if (/\b(khichdi|khichuri|moong\s*dal.*porridge|lentil.*rice.*porridge)\b/i.test(t)) {
    return 'Moong Dal Khichdi with Dahi';
  }
  if (/\b(dal|lentil|split.*pea|toor|moong|urad|masoor)\b/i.test(t)) {
    if (hasRice && hasRoti) return 'Dal Chawal with Phulka Roti';
    if (hasRice) return 'Dal Tadka with Steamed Rice';
    if (hasRoti) return 'Dal Tadka with Ghar Ki Roti';
    return 'Dal Tadka';
  }

  // Paneer Dishes
  if (/\b(paneer|cottage\s*cheese)\b/i.test(t)) {
    if (/\b(paratha|stuffed.*flatbread|flatbread.*stuffed)\b/i.test(t)) {
      return 'Paneer Paratha with Dahi';
    }
    if (/\b(palak|spinach|saag)\b/i.test(t)) {
      return 'Palak Paneer with Phulka Roti';
    }
    if (/\b(butter|makhani|creamy.*tomato|rich.*tomato|tomato.*butter|shahi)\b/i.test(t)) {
      return 'Paneer Butter Masala with Roti';
    }
    if (/\b(kadai|karahi|bell\s*peppers?|capsicum|wok)\b/i.test(t)) {
      return 'Kadai Paneer with Naan';
    }
    if (/\b(tikka|roasted|grilled|skewer)\b/i.test(t)) {
      return 'Paneer Tikka with Mint Chutney';
    }
    if (/\b(bhurji|scramble)\b/i.test(t)) {
      return 'Paneer Bhurji with Multigrain Roti';
    }
    if (/\b(matar|mutter|peas?)\b/i.test(t)) {
      return 'Matar Paneer with Jeera Rice';
    }
    if (/\b(kofta|dumpling)\b/i.test(t)) {
      return 'Malai Kofta with Naan';
    }
    return 'Paneer Butter Masala with Roti';
  }

  // Chicken & Meats
  if (/\b(chicken|murgh)\b/i.test(t)) {
    if (/\b(breast|grilled\s*chicken)\b/i.test(t) && !/\b(curry|gravy)\b/i.test(t)) {
      return 'Tandoori Grilled Chicken Breast';
    }
    if (/\b(biryani|layered.*rice|fragrant.*rice)\b/i.test(t)) {
      return 'Chicken Dum Biryani with Raita';
    }
    if (/\b(butter|makhani|creamy.*tomato|tomato.*butter)\b/i.test(t)) {
      return 'Butter Chicken (Murgh Makhani) with Naan';
    }
    if (/\b(tandoor|clay\s*oven|roasted|tikka)\b/i.test(t)) {
      return 'Tandoori Chicken';
    }
    if (/\b(kadai|karahi)\b/i.test(t)) {
      return 'Kadai Chicken with Naan';
    }
    if (hasRice) return 'Desi Chicken Curry with Steamed Rice';
    if (hasRoti) return 'Chicken Curry with Tandoori Roti';
    return 'Desi Chicken Curry';
  }

  // Mutton, Fish & Seafood
  if (/\b(mutton|lamb|goat|keema)\b/i.test(t)) {
    if (/\b(biryani)\b/i.test(t)) return 'Mutton Dum Biryani with Raita';
    if (/\b(keema|minced)\b/i.test(t)) return 'Mutton Keema Pav';
    if (/\b(rogan\s*josh|kashmiri.*(lamb|mutton|curry))\b/i.test(t)) return 'Mutton Rogan Josh with Basmati Rice';
    return 'Desi Mutton Curry with Steamed Rice';
  }
  if (/\b(fish|mach)\b/i.test(t)) {
    if (/\b(goan|coconut)\b/i.test(t)) return 'Goan Fish Curry with Steamed Rice';
    return 'Indian Fish Curry with Steamed Rice';
  }

  // Biryanis & Rice
  if (/\b(biryani)\b/i.test(t)) {
    if (/\b(mutton|lamb)\b/i.test(t)) return 'Mutton Dum Biryani with Raita';
    if (/\b(chicken)\b/i.test(t)) return 'Chicken Dum Biryani with Raita';
    return 'Veg Dum Biryani with Raita';
  }
  if (/\b(jeera\s*rice|cumin\s*rice)\b/i.test(t)) {
    return 'Jeera Rice';
  }

  // Sabzis & Specific Vegetables
  if (/\b(aloo|potato|potatoes)\b/i.test(t) && /\b(gobi|cauliflower|gobhi)\b/i.test(t)) {
    return 'Aloo Gobi with Roti';
  }
  if (/\b(aloo|potato|potatoes)\b/i.test(t) && /\b(matar|mutter|peas?)\b/i.test(t)) {
    return 'Aloo Matar Sabzi with Roti';
  }
  if (/\b(aloo|potato|potatoes)\b/i.test(t) && /\b(paratha|stuffed.*flatbread|flatbread.*stuffed)\b/i.test(t)) {
    return 'Aloo Paratha with Dahi & Makkhan';
  }
  if (/\b(aloo|potato|potatoes)\b/i.test(t) && /\b(methi|fenugreek)\b/i.test(t)) {
    return 'Aloo Methi with Roti';
  }
  if (/\b(aloo|potato|potatoes)\b/i.test(t) && /\b(jeera|cumin)\b/i.test(t)) {
    return 'Jeera Aloo with Phulka Roti';
  }
  if (/\b(bhindi|okra|lady\s*finger)\b/i.test(t)) {
    return 'Bhindi Masala with Roti';
  }
  if (/\b(baingan|eggplant|aubergine|brinjal)\b/i.test(t)) {
    if (/\b(bharta|mash|roasted|smoke)\b/i.test(t)) return 'Baingan Ka Bharta with Phulka';
    if (/\b(bharli|stuffed)\b/i.test(t)) return 'Bharli Vangi with Bhakri';
    return 'Aloo Baingan Sabzi with Roti';
  }
  if (/\b(karela|bitter\s*gourd)\b/i.test(t)) {
    return 'Karela Masala with Phulka Roti';
  }
  if (/\b(lauki|bottle\s*gourd|dudhi|ghiya)\b/i.test(t)) {
    if (/\b(kofta)\b/i.test(t)) return 'Lauki Kofta Curry with Roti';
    return 'Lauki Chana Dal Sabzi with Roti';
  }
  if (/\b(turai|tori|ridge\s*gourd)\b/i.test(t)) {
    return 'Tori Ki Sabzi with Phulka Roti';
  }
  if (/\b(arbi|colocasia|taro)\b/i.test(t)) {
    return 'Sukhi Masala Arbi with Paratha';
  }
  if (/\b(soya\s*chunks?|nutrela)\b/i.test(t)) {
    return 'Soya Chunks Curry with Brown Rice';
  }
  if (/\b(besan\s*chilla|chilla)\b/i.test(t)) {
    return 'Besan Chilla with Mint Chutney';
  }

  // Breads / Rotis
  if (/\b(naan)\b/i.test(t)) {
    return 'Butter Garlic Naan';
  }
  if (/\b(paratha)\b/i.test(t)) {
    return 'Laccha Paratha';
  }
  if (/\b(puri|poori)\b/i.test(t)) {
    return 'Puri Sabzi';
  }
  if (/\b(roti|chapati|phulka|unleavened.*flatbread|whole\s*wheat.*flatbread|puffed.*flatbread|flatbread.*tawa|tawa.*flatbread)\b/i.test(t)) {
    return 'Ghar Ki Roti (Phulka)';
  }

  // Sweets & Beverages
  if (/\b(gulab\s*jamun|milk\s*solid.*(syrup|ball|dumpling)s?)\b/i.test(t)) {
    return 'Gulab Jamun';
  }
  if (/\b(jalebi|spiral.*(sweet|batter|flour)|funnel.*(syrup|cake)|crisp.*spiral)\b/i.test(t)) {
    return 'Crispy Jalebi';
  }
  if (/\b(rasgulla|rasmalai|chhena.*dumpling.*milk|chhena.*milk)\b/i.test(t)) {
    return 'Rasmalai';
  }
  if (/\b(gajar\s*halwa|carrot\s*halwa|grated.*carrot.*(milk|khoya))\b/i.test(t)) {
    return 'Gajar Ka Halwa';
  }
  if (/\b(kheer|payasam|rice\s*pudding|rice.*simmered.*milk)\b/i.test(t)) {
    return 'Rice Kheer with Nuts';
  }
  if (/\b(lassi|(sweet|mango).*yogurt.*drink|churned.*sweet.*(yogurt|curd))\b/i.test(t)) {
    return 'Sweet Mango Lassi';
  }
  if (/\b(chaas|buttermilk|churned.*(yogurt|curd).*tempered|churned.*(yogurt|curd).*(cumin|salt|mint)|spiced.*churned.*(yogurt|curd)|churned.*spiced.*(yogurt|curd))\b/i.test(t)) {
    return 'Masala Chaas (Spiced Buttermilk)';
  }
  if (/\b(chai|tea.*simmered.*milk|tea.*brewed.*milk|black\s*tea.*milk|spiced.*milk.*tea|tea.*milk)\b/i.test(t)) {
    return 'Masala Chai';
  }

  return null;
}

/**
 * Synthesizes an authentic Indian meal/combo name from multiple detected ingredients.
 */
function synthesizeFromIngredients(ingredients: IngredientInput[]): string | null {
  if (!ingredients || ingredients.length === 0) return null;

  const rawNames = ingredients.map((i) => i.name.toLowerCase()).join(' ');
  const cleaned = replaceScientificNames(rawNames).toLowerCase();

  const semantic = matchSemanticIndianDish(cleaned);
  if (semantic) return semantic;

  const hasRoti = /\b(roti|chapati|phulka|flatbread|wheat|atta|paratha|naan|bhakri)\b/i.test(cleaned);
  const hasRice = /\b(rice|chawal|basmati|pulao|grain)\b/i.test(cleaned);
  const hasDal = /\b(dal|lentil|toor|moong|urad|masoor|sambar)\b/i.test(cleaned);
  const hasPaneer = /\b(paneer|cottage cheese)\b/i.test(cleaned);
  const hasChole = /\b(chole|chana|chickpea|garbanzo)\b/i.test(cleaned);
  const hasRajma = /\b(rajma|kidney bean)\b/i.test(cleaned);
  const hasChicken = /\b(chicken|murgh|poultry)\b/i.test(cleaned);
  const hasEgg = /\b(egg|anda)\b/i.test(cleaned);
  const hasFish = /\b(fish|mach|prawn)\b/i.test(cleaned);
  const hasPuri = /\b(puri|poori|bhatura|luchi)\b/i.test(cleaned);
  const hasIdli = /\b(idli|steamed cake)\b/i.test(cleaned);
  const hasDosa = /\b(dosa|crepe)\b/i.test(cleaned);

  // Specific vegetables in ingredients
  const hasAloo = /\b(aloo|potato)\b/i.test(cleaned);
  const hasGobi = /\b(gobi|cauliflower)\b/i.test(cleaned);
  const hasPalak = /\b(palak|spinach)\b/i.test(cleaned);
  const hasBhindi = /\b(bhindi|okra)\b/i.test(cleaned);
  const hasBaingan = /\b(baingan|eggplant|brinjal)\b/i.test(cleaned);
  const hasMatar = /\b(matar|mutter|pea)\b/i.test(cleaned);
  const hasSarson = /\b(sarson|mustard)\b/i.test(cleaned);
  const hasMakki = /\b(makki|corn)\b/i.test(cleaned);

  // Grand Thali: Roti + Rice + Dal + Sabzi
  const hasSabzi = hasAloo || hasGobi || hasPalak || hasBhindi || hasBaingan || hasPaneer || hasMatar || /\b(sabzi|curry|vegetable)\b/i.test(cleaned);
  if (hasRoti && hasRice && hasDal && hasSabzi) {
    return 'North Indian Thali (Roti, Dal Tadka, Sabzi & Jeera Rice)';
  }

  // Classic Vegetable Combos
  if (hasSarson && hasMakki) return 'Sarson Ka Saag with Makki Di Roti';
  if (hasAloo && hasGobi) return hasRoti ? 'Aloo Gobi with Roti' : 'Aloo Gobi';
  if (hasAloo && hasMatar) return hasRoti ? 'Aloo Matar Sabzi with Roti' : 'Aloo Matar Sabzi';
  if (hasPalak && hasPaneer) return hasRoti ? 'Palak Paneer with Phulka Roti' : 'Palak Paneer';
  if (hasMatar && hasPaneer) return hasRice ? 'Matar Paneer with Jeera Rice' : 'Matar Paneer';
  if (hasBhindi && hasRoti) return 'Bhindi Masala with Roti';
  if (hasBaingan && hasRoti) return 'Baingan Ka Bharta with Phulka';

  // Classic Combos
  if (hasRajma && hasRice) return 'Rajma Chawal';
  if (hasChole && hasRice) return 'Chole Chawal';
  if (hasChole && hasPuri) return 'Chole Bhature with Pickled Onions';
  if (hasDal && hasRice && hasRoti) return 'Dal Chawal with Phulka Roti';
  if (hasDal && hasRice) return 'Dal Tadka with Steamed Rice';
  if (hasDal && hasRoti) return 'Dal Tadka with Ghar Ki Roti';
  if (hasPaneer && (hasRoti || hasRice)) return 'Paneer Butter Masala with Roti';
  if (hasChicken && hasRice) return 'Desi Chicken Curry with Steamed Rice';
  if (hasChicken && hasRoti) return 'Chicken Curry with Tandoori Roti';
  if (hasFish && hasRice) return 'Indian Fish Curry with Steamed Rice';
  if (hasEgg && (hasRoti || hasPuri)) return 'Egg Bhurji with Whole Wheat Roti';
  if (hasRoti && hasSabzi) return 'Ghar Ki Roti with Seasonal Sabzi';
  if (hasIdli && hasDal) return 'Idli Sambar with Coconut Chutney';
  if (hasDosa && hasDal) return 'Masala Dosa with Sambar & Chutney';
  if (hasRice && hasDal) return 'Dal Chawal';

  return null;
}

/**
 * Localizes common western/fitness items into an Indian context.
 */
function localizeWesternFitnessFood(name: string): string | null {
  const n = name.toLowerCase();

  if (n.includes('avocado') && (n.includes('toast') || n.includes('bread'))) {
    return 'Multigrain Avocado Toast with Egg';
  }
  if (n.includes('chicken breast') || (n.includes('grilled chicken') && !n.includes('salad'))) {
    return 'Tandoori Grilled Chicken Breast';
  }
  if (n.includes('quinoa') && n.includes('bowl')) {
    return 'Desi Quinoa & Sprout Protein Bowl';
  }
  if (n.includes('whey') || (n.includes('protein') && n.includes('shake'))) {
    return 'Whey Protein Shake (Badam Kesar)';
  }
  if (n.includes('oat') || n.includes('oatmeal')) {
    return 'Masala Oats with Veggies';
  }
  if (n.includes('greek yogurt') || (n.includes('yogurt') && n.includes('berries'))) {
    return 'Fresh Dahi (Curd) with Honey & Nuts';
  }
  if (n.includes('boiled egg')) {
    return 'Boiled Eggs with Chaat Masala (3 Eggs)';
  }
  if (n.includes('sprout') || (n.includes('salad') && (n.includes('moong') || n.includes('chana')))) {
    return 'Sprouted Moong Chaat with Lemon';
  }
  if (n.includes('salad')) {
    return 'Fresh Kachumber Salad with Lemon';
  }
  if (n.includes('sandwich')) {
    return 'Bombay Masala Grilled Sandwich';
  }
  if (n.includes('pizza')) {
    return 'Paneer Tikka Desi Pizza';
  }
  if (n.includes('burger')) {
    return 'Veg Aloo Tikki Burger';
  }
  if (n.includes('pasta')) {
    return 'Desi Masala Macaroni Pasta';
  }

  return null;
}

/**
 * Main exported function to resolve any scanned meal name, ingredients, or description
 * into an authentic, typical Indian dish name.
 */
export function toTypicalIndianMealName(
  inputName?: string,
  ingredients?: IngredientInput[],
  description?: string
): string {
  const raw = (inputName || '').trim();
  const desc = (description || '').trim();

  // Step 1: Immediately translate any Latin / scientific terms in input
  const cleanRaw = replaceScientificNames(raw);
  const cleanDesc = replaceScientificNames(desc);
  const combined = `${cleanRaw} ${cleanDesc}`.trim();

  // Step 2: Semantic Indian dish matching
  const semanticMatch = matchSemanticIndianDish(combined);
  if (semanticMatch) {
    return semanticMatch;
  }

  // Step 3: Check for multi-ingredient combo or Thali
  if (ingredients && ingredients.length > 0) {
    const combo = synthesizeFromIngredients(ingredients);
    if (combo) return combo;
  }

  // Step 4: Check if clean name can be localized from Western fitness terms
  const westernLocalized = localizeWesternFitnessFood(cleanRaw);
  if (westernLocalized) return westernLocalized;

  // Step 5: Check if the clean name is already an authentic Indian name
  const indianKeywords = [
    'dal', 'chawal', 'roti', 'chapati', 'paratha', 'naan', 'puri', 'poori',
    'bhatur', 'chole', 'chana', 'rajma', 'khichdi', 'poha', 'upma', 'idli',
    'dosa', 'vada', 'sambar', 'rasam', 'biryani', 'pulao', 'paneer', 'palak',
    'aloo', 'gobi', 'bhindi', 'baingan', 'karela', 'lauki', 'matar', 'mutter',
    'bhurji', 'tikka', 'tandoori', 'korma', 'kofta', 'makhani', 'saag', 'keema',
    'chaat', 'samosa', 'pakora', 'dhokla', 'thepla', 'pav bhaji', 'misal',
    'lassi', 'chaas', 'chai', 'gulab jamun', 'jalebi', 'kheer', 'halwa', 'sabzi',
    'macher jhol', 'kosha mangsho', 'litti', 'sattu', 'momos', 'thukpa', 'avial',
    'pongal', 'uttapam', 'thalipeeth', 'pithla', 'khandvi', 'undhiyu'
  ];

  const lowerClean = cleanRaw.toLowerCase();
  const hasIndianKeyword = indianKeywords.some((kw) => lowerClean.includes(kw));

  if (hasIndianKeyword) {
    // Strip generic English words
    let formatted = cleanRaw
      .replace(/\b(bowl|portion|plate|homemade|style|delicious|fresh)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Capitalize first letter of each word
    formatted = formatted
      .split(' ')
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');

    return formatted || cleanRaw;
  }

  // Step 6: Generic fallbacks
  const isGeneric =
    !cleanRaw ||
    cleanRaw.toLowerCase() === 'nutritious meal' ||
    cleanRaw.toLowerCase() === 'ai analyzed meal photo' ||
    cleanRaw.toLowerCase() === 'food' ||
    cleanRaw.toLowerCase() === 'meal' ||
    cleanRaw.toLowerCase() === 'healthy meal' ||
    cleanRaw.toLowerCase() === 'healthy dish';

  if (isGeneric) {
    if (ingredients && ingredients.length > 0) {
      const combo = synthesizeFromIngredients(ingredients);
      if (combo) return combo;
    }
    return 'Ghar Ka Khana (Dal, Roti & Seasonal Sabzi)';
  }

  // Step 7: Return the cleaned name (guaranteed free of scientific terms)
  return cleanRaw;
}
