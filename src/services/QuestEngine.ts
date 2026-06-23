import { supabase, QuestResponse } from '../lib/supabaseClient';
import osmMapping from '../config/osm_mapping.json';

const MOCK_DB = [
  {
    "id": "mock1",
    "title": "map.markers.garrosh",
    "type": "npc",
    "location": {
      "coordinates": [
        9.7353,
        52.3718
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.garrosh.start",
          "options": [
            {
              "label": "map.dialogs.garrosh.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.garrosh.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.garrosh.ask_trade",
          "options": [
            {
              "label": "map.dialogs.garrosh.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.garrosh.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.garrosh.accept_quest",
          "action": "trade_iron",
          "options": [
            {
              "label": "map.dialogs.garrosh.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock2",
    "title": "map.markers.alkuin",
    "type": "npc",
    "location": {
      "coordinates": [
        9.7386,
        52.3744
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.alkuin.start",
          "options": [
            {
              "label": "map.dialogs.alkuin.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.alkuin.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.alkuin.ask_trade",
          "options": [
            {
              "label": "map.dialogs.alkuin.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.alkuin.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.alkuin.accept_quest",
          "action": "give_quest",
          "questRequirement": {
            "itemId": "mushrooms",
            "amount": 3,
            "maxGathers": 3
          },
          "options": [
            {
              "label": "map.dialogs.alkuin.opt_farewell",
              "next": "end"
            }
          ]
        },
        "check_quest_progress": {
          "text": "map.dialogs.alkuin.check_quest_progress",
          "options": [
            {
              "label": "map.dialogs.common.give_items",
              "next": "complete_quest"
            },
            {
              "label": "map.dialogs.common.not_yet",
              "next": "end"
            }
          ]
        },
        "complete_quest": {
          "text": "map.dialogs.alkuin.complete_quest",
          "action": "finish_quest",
          "options": [
            {
              "label": "map.dialogs.common.you_are_welcome",
              "next": "end"
            }
          ]
        },
        "quest_already_completed": {
          "text": "map.dialogs.alkuin.quest_already_completed",
          "options": [
            {
              "label": "map.dialogs.alkuin.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock3",
    "title": "map.markers.leif",
    "type": "npc",
    "location": {
      "coordinates": [
        9.741,
        52.3769
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.leif.start",
          "options": [
            {
              "label": "map.dialogs.leif.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.leif.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.leif.ask_trade",
          "options": [
            {
              "label": "map.dialogs.leif.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.leif.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.leif.accept_quest",
          "action": "give_quest",
          "questRequirement": {
            "itemId": "wood_log",
            "amount": 5,
            "maxGathers": 3
          },
          "options": [
            {
              "label": "map.dialogs.leif.opt_farewell",
              "next": "end"
            }
          ]
        },
        "check_quest_progress": {
          "text": "map.dialogs.leif.check_quest_progress",
          "options": [
            {
              "label": "map.dialogs.common.give_items",
              "next": "complete_quest"
            },
            {
              "label": "map.dialogs.common.not_yet",
              "next": "end"
            }
          ]
        },
        "complete_quest": {
          "text": "map.dialogs.leif.complete_quest",
          "action": "finish_quest",
          "options": [
            {
              "label": "map.dialogs.common.you_are_welcome",
              "next": "end"
            }
          ]
        },
        "quest_already_completed": {
          "text": "map.dialogs.leif.quest_already_completed",
          "options": [
            {
              "label": "map.dialogs.leif.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock4",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.738094259991769,
        52.35762301582558
      ]
    },
    "data": {}
  },
  {
    "id": "mock5",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.79356787038036,
        52.34210577077039
      ]
    },
    "data": {}
  },
  {
    "id": "mock6",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.782223214237654,
        52.38262161993785
      ]
    },
    "data": {}
  },
  {
    "id": "mock7",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.740529337001732,
        52.39969854668834
      ]
    },
    "data": {}
  },
  {
    "id": "mock8",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.792053695237831,
        52.36432172276473
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock9",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.683582510381987,
        52.39140829940961
      ]
    },
    "data": {}
  },
  {
    "id": "mock10",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.711140829621298,
        52.34662056525388
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 1,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock11",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.758075522744816,
        52.400987884663074
      ]
    },
    "data": {}
  },
  {
    "id": "mock12",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.79948111259866,
        52.39019738805535
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock13",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.705508543203544,
        52.395203358214445
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock14",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.725992248664673,
        52.36792271495682
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock15",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.79598318975227,
        52.342811614906424
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock16",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.687320812670242,
        52.34160955006168
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock17",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.685840554833304,
        52.341387121668184
      ]
    },
    "data": {}
  },
  {
    "id": "mock18",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.767752519553818,
        52.36702516680154
      ]
    },
    "data": {}
  },
  {
    "id": "mock19",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.689380441986057,
        52.35194808843039
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock20",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.714694871755087,
        52.40240548508272
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock21",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.780477242530438,
        52.35484891726101
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock22",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.704207810721938,
        52.39524949159445
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock23",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.7226003543848,
        52.36581099711616
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock24",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.686612406585294,
        52.40237085866334
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock25",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.767445700804533,
        52.376554939048376
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock26",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.799188757543213,
        52.358772190933415
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock27",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.741808114925346,
        52.37716123110735
      ]
    },
    "data": {}
  },
  {
    "id": "mock28",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.702349652206701,
        52.38214971253992
      ]
    },
    "data": {}
  },
  {
    "id": "mock29",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.697402223232636,
        52.40645891409771
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock30",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.744400735014743,
        52.38579603072228
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock31",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        9.7830988976525,
        52.346284905567956
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock32",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.72199616049195,
        52.3824594590078
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock33",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.74752425343125,
        52.39314107585464
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock34",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.788195300910994,
        52.37576645548285
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock35",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.704680076433752,
        52.405153979207434
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock36",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.692614373587972,
        52.38690735611799
      ]
    },
    "data": {}
  },
  {
    "id": "mock37",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.680367363881473,
        52.34553584226132
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock38",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.795060249822711,
        52.34847161302769
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock39",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.782455574083672,
        52.39965393737772
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock40",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.736527410336217,
        52.37022417994967
      ]
    },
    "data": {}
  },
  {
    "id": "mock41",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.728970442851168,
        52.363986506681364
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock42",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.79094684423371,
        52.40461981646028
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock43",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.725383473653682,
        52.36860209211861
      ]
    },
    "data": {}
  },
  {
    "id": "mock44",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.752797052101254,
        52.37025340235772
      ]
    },
    "data": {}
  },
  {
    "id": "mock45",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.761189276452901,
        52.37321807398288
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock46",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.771949728107526,
        52.35228939469429
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock47",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.69098670581433,
        52.40787164439633
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock48",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.722908099787176,
        52.3530311330771
      ]
    },
    "data": {}
  },
  {
    "id": "mock49",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.71393555759054,
        52.397649138129644
      ]
    },
    "data": {}
  },
  {
    "id": "mock50",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.767171341393158,
        52.370928777010306
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock51",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.787042840705768,
        52.34500621919316
      ]
    },
    "data": {}
  },
  {
    "id": "mock52",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.72277633194921,
        52.39548228251635
      ]
    },
    "data": {}
  },
  {
    "id": "mock53",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.709061654667796,
        52.34809539762722
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock54",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.702160312644546,
        52.3654674959705
      ]
    },
    "data": {}
  },
  {
    "id": "mock55",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.691323362675325,
        52.3980979827325
      ]
    },
    "data": {}
  },
  {
    "id": "mock56",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.734003749262222,
        52.343541047445065
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock57",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.776144838415913,
        52.377610517980884
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock58",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.722537853805033,
        52.39028248085948
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock59",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.691640812379722,
        52.39734638892644
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock60",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.726198400290011,
        52.39832518328351
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock61",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.796790185357226,
        52.34943624289908
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock62",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.712003703268444,
        52.35814333590494
      ]
    },
    "data": {}
  },
  {
    "id": "mock63",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.735817857019258,
        52.37683793219419
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock64",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.77341989829152,
        52.38770172564147
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock65",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.765539497638025,
        52.37948890835285
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock66",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.761753679894944,
        52.36497686278144
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock67",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.794474213323236,
        52.363779851991666
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock68",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.736719030154916,
        52.35426553200337
      ]
    },
    "data": {}
  },
  {
    "id": "mock69",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.718697743730218,
        52.40883223782182
      ]
    },
    "data": {}
  },
  {
    "id": "mock70",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773073999578362,
        52.36841102012276
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock71",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.693627702846443,
        52.37599083591725
      ]
    },
    "data": {}
  },
  {
    "id": "mock72",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.749913903125424,
        52.36919542705709
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock73",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773619545869797,
        52.376359676755655
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock74",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.72557594672308,
        52.396440425421765
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock75",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.771641738029265,
        52.349301985217316
      ]
    },
    "data": {}
  },
  {
    "id": "mock76",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.75392601386874,
        52.37076339439455
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock77",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.766025202898096,
        52.36005754713707
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock78",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.77670590696684,
        52.349519721540226
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock79",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.710214798566385,
        52.37686373369545
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock80",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.706587407617207,
        52.361781287047634
      ]
    },
    "data": {}
  },
  {
    "id": "mock81",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.753583246567265,
        52.396993355254224
      ]
    },
    "data": {}
  },
  {
    "id": "mock82",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.799928377487275,
        52.34688372680582
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock83",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.703253431267152,
        52.380845368802134
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock84",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.744965076074788,
        52.37242438400112
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock85",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.70805023014043,
        52.405868901282446
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock86",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.709901927186635,
        52.3639870050832
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock87",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.714521394000494,
        52.369779475463965
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock88",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.794450001330048,
        52.40949366731842
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock89",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        9.775495410031544,
        52.34628860240865
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock90",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.77963834205287,
        52.36789527560108
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock91",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.701300161303248,
        52.3612237338103
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock92",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.755363317360638,
        52.37389643300844
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock93",
    "title": "map.markers.shop",
    "type": "shop",
    "location": {
      "coordinates": [
        9.689276026506102,
        52.40310775644788
      ]
    },
    "data": {}
  },
  {
    "id": "mock94",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.757910897079755,
        52.34720938174664
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock95",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.789257475014328,
        52.383579431089046
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock96",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.793347149380931,
        52.38006113904187
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock97",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.789860149368664,
        52.3916033402571
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock98",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.757343573840998,
        52.393812520934326
      ]
    },
    "data": {}
  },
  {
    "id": "mock99",
    "title": "map.markers.beggar",
    "type": "npc",
    "location": {
      "coordinates": [
        9.763728000833646,
        52.40490407500589
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock100",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.75092012612977,
        52.34160696103785
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock101",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.79114914869407,
        52.384419715064666
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock102",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.785526858101665,
        52.395157493067174
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock103",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.724203958732387,
        52.37058793065756
      ]
    },
    "data": {}
  },
  {
    "id": "mock104",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.338630273259493,
        52.489613502870505
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock105",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.364166417728741,
        52.47315581181466
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock106",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.356416044131839,
        52.48868932089378
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock107",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.359129207213815,
        52.49587603880123
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock108",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.368902911935136,
        52.47902359390154
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock109",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.320518620868226,
        52.47548011521939
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock110",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.34678934802186,
        52.47397809426406
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock111",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.359865619360534,
        52.47948770420018
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock112",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.337447173078727,
        52.474009663302674
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock113",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.354557796636689,
        52.4825899436503
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock114",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.340155357231811,
        52.492513577258926
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock115",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.338868260446086,
        52.4833195227218
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock116",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.339634008493508,
        52.47316613105749
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock117",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.331656860141065,
        52.47316336014139
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock118",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.344432075278702,
        52.479314612291674
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock119",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.360545771310612,
        52.47244282356592
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock120",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.349824750434564,
        52.487592985552006
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock121",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.35257914710354,
        52.49803453300779
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock122",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.353851447540075,
        52.48702250371799
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock123",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.347841805448798,
        52.47660346805694
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock124",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.352042357493072,
        52.48606955484883
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock125",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.357662032885342,
        52.48826286269719
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock126",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.336238311538255,
        52.48978378296323
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock127",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.36189925528681,
        52.47822727339142
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock128",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.335419785107053,
        52.47886771798474
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock129",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.34087566895096,
        52.4885874573438
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock130",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.352499902213406,
        52.47745156436615
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock131",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.338666339175738,
        52.47806371251595
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock132",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.334143053518318,
        52.49747244019848
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock133",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.331108656697142,
        52.47579047913727
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock134",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        10.183874542258975,
        52.29635623718288
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock135",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.871929916637027,
        52.30517469761307
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock136",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.376666087987699,
        52.67562648651408
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock137",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.377666087987699,
        52.67662648651408
      ]
    },
    "data": {}
  },
  {
    "id": "mock138",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.698289733356543,
        52.58957088250218
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock139",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.881907627388554,
        52.159962254519044
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock140",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.022870003488851,
        52.670387396492515
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock141",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.263734157809319,
        52.632466561278946
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock142",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        10.158582850789523,
        52.60822312140395
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock143",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        10.159582850789523,
        52.60922312140395
      ]
    },
    "data": {}
  },
  {
    "id": "mock144",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        10.120578146306842,
        52.04217445770573
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock145",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.684594096033555,
        52.60880332020207
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock146",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.47193406612255,
        52.471987493351364
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock147",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.543062842567249,
        52.6956386280677
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock148",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        9.128838059855589,
        52.268028010538
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock149",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.129838059855588,
        52.269028010538
      ]
    },
    "data": {}
  },
  {
    "id": "mock150",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.704052175977546,
        52.377673851660944
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock151",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.216935897513652,
        52.668283388206376
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock152",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        10.080666923046145,
        52.60393058228701
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock153",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.3881223215445,
        52.64923749446892
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock154",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.3891223215445,
        52.65023749446892
      ]
    },
    "data": {}
  },
  {
    "id": "mock155",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.249724014554486,
        52.15508456107218
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock156",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        10.040013067852252,
        52.155859366558474
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock157",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        10.217549405380804,
        52.54595084861776
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock158",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.377270112094557,
        52.20510533867457
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock159",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.726674728404841,
        52.30974738912903
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock160",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.598294057047992,
        52.46677547422589
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock161",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.91147530151066,
        52.663118393855534
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock162",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.595373498092695,
        52.653192185014206
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock163",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.596373498092694,
        52.6541921850142
      ]
    },
    "data": {}
  },
  {
    "id": "mock164",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.483222718701505,
        52.41426099143074
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock165",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.936716886621497,
        52.363438227401865
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock166",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.937716886621496,
        52.36443822740186
      ]
    },
    "data": {}
  },
  {
    "id": "mock167",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.6759757993081,
        52.50911260772124
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock168",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.878665612764017,
        52.69256286340208
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock169",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.879665612764017,
        52.69356286340208
      ]
    },
    "data": {}
  },
  {
    "id": "mock170",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.181070593616775,
        52.57819505355941
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock171",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.608082329569333,
        52.53367885235467
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock172",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.46470196460257,
        52.643891010292
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock173",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.066566571211839,
        52.21745923991591
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock174",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.997296988987836,
        52.18569480702472
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock175",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.787591236755581,
        52.33255471260745
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock176",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.011902401842896,
        52.54180721471729
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock177",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        9.600076965432306,
        52.563620351502706
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock178",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.051162473312846,
        52.617052710582186
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock179",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.867436037347796,
        52.43648203395997
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock180",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        10.225997281918463,
        52.556440994796866
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock181",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.697471947476657,
        52.608871286730576
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock182",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        10.193989564927833,
        52.63069506767937
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock183",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.24213071641297,
        52.05168114193339
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock184",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        10.243130716412969,
        52.05268114193339
      ]
    },
    "data": {}
  },
  {
    "id": "mock185",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        10.19514628934224,
        52.30125033765121
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock186",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.81326289677444,
        52.467124242088445
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock187",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.814262896774439,
        52.46812424208844
      ]
    },
    "data": {}
  },
  {
    "id": "mock188",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        10.116921683457447,
        52.612694167148994
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock189",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.351577496916956,
        52.61527123639258
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock190",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.352577496916956,
        52.61627123639258
      ]
    },
    "data": {}
  },
  {
    "id": "mock191",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.588774529932216,
        52.47535731371169
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock192",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.74965683449565,
        52.534395610611625
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock193",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.750656834495649,
        52.53539561061162
      ]
    },
    "data": {}
  },
  {
    "id": "mock194",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.388817836874157,
        52.49788423634998
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock195",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.733090131437548,
        52.21448921895932
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock196",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.86862495222453,
        52.58627653711253
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock197",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.546331475263814,
        52.315919672225945
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock198",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.851529358324294,
        52.156965429500424
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock199",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.25518857337824,
        52.447500958973784
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock200",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.02438806176282,
        52.15236422773384
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock201",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.02798694762766,
        52.22714840053963
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock202",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.383096633050176,
        52.2516035441386
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock203",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.515860777436966,
        52.45911493316339
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock204",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        10.286207665719772,
        52.420616923567984
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock205",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.469013889183206,
        52.675829932873285
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock206",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.383801548842216,
        52.35786274191962
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock207",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        9.62185478831741,
        52.636056022635856
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock208",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        9.850916836749951,
        52.38736512661694
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock209",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.593543376283932,
        52.141794116462556
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock210",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.594543376283932,
        52.142794116462554
      ]
    },
    "data": {}
  },
  {
    "id": "mock211",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.841605069427322,
        52.573045630371276
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock212",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.842605069427321,
        52.57404563037127
      ]
    },
    "data": {}
  },
  {
    "id": "mock213",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.110496882469388,
        52.521579001394315
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock214",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.286940967469999,
        52.09049282090813
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock215",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.933692504481181,
        52.3124355317043
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock216",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        10.015735258532207,
        52.147873756672965
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock217",
    "title": "map.markers.city_mushrooms",
    "type": "resource",
    "location": {
      "coordinates": [
        10.126656656779915,
        52.54948657897165
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock218",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        10.127656656779914,
        52.55048657897165
      ]
    },
    "data": {}
  },
  {
    "id": "mock219",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        10.079596490241691,
        52.25037684806876
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock220",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.351974152111753,
        52.37529627962654
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock221",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.218002642064297,
        52.5129958542741
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock222",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.894575785436933,
        52.239742004581636
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock223",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.895575785436932,
        52.240742004581634
      ]
    },
    "data": {}
  },
  {
    "id": "mock224",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.721494120868483,
        52.33874640583965
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock225",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        9.428530735662495,
        52.39675568658157
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock226",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.372391644380638,
        52.69076388234083
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock227",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.726745343756296,
        52.559142894534936
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock228",
    "title": "map.markers.berry_bush",
    "type": "resource",
    "location": {
      "coordinates": [
        9.914964696702707,
        52.27292555449462
      ]
    },
    "data": {
      "resource": {
        "itemId": "berries",
        "name": "Beeren",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock229",
    "title": "map.markers.fallen_tree",
    "type": "resource",
    "location": {
      "coordinates": [
        9.894656295046774,
        52.2479979740748
      ]
    },
    "data": {
      "resource": {
        "itemId": "wood_log",
        "name": "Holzstamm",
        "type": "material",
        "amount": 5,
        "maxGathers": 5
      }
    }
  },
  {
    "id": "mock230",
    "title": "map.markers.hidden_well",
    "type": "resource",
    "location": {
      "coordinates": [
        9.004743348860936,
        52.043859354972895
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock231",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.005743348860936,
        52.04485935497289
      ]
    },
    "data": {}
  },
  {
    "id": "mock232",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.042053290435371,
        52.67269839945641
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock233",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.02080890931852,
        52.65860769126762
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock234",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        10.235977267370476,
        52.66899121416509
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock235",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.758113070018503,
        52.22468377332045
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock236",
    "title": "map.markers.herb_patch",
    "type": "resource",
    "location": {
      "coordinates": [
        10.181128819758564,
        52.45428797334221
      ]
    },
    "data": {
      "resource": {
        "itemId": "herb_root",
        "name": "Heilwurzel",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock237",
    "title": "map.markers.salt_water_source",
    "type": "resource",
    "location": {
      "coordinates": [
        9.168623530836024,
        52.19644311396711
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt_water",
        "name": "Salzwasser",
        "type": "material",
        "amount": 3,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock238",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.086726483622444,
        52.34256358042762
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock239",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        9.131330038606396,
        52.62322712130635
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock240",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        9.615139265686143,
        52.04313723619478
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock241",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.616139265686142,
        52.04413723619478
      ]
    },
    "data": {}
  },
  {
    "id": "mock242",
    "title": "map.markers.feast_leftover",
    "type": "resource",
    "location": {
      "coordinates": [
        10.231866739291938,
        52.548436608823586
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock243",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        10.232866739291937,
        52.549436608823584
      ]
    },
    "data": {}
  },
  {
    "id": "mock244",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.525771091394535,
        52.15604008266877
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock245",
    "title": "map.markers.iron_vein",
    "type": "resource",
    "location": {
      "coordinates": [
        10.207995627800145,
        52.419115800563965
      ]
    },
    "data": {
      "resource": {
        "itemId": "iron_ore",
        "name": "Eisenerz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock246",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.072808186704899,
        52.395990501674426
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock247",
    "title": "map.markers.stone_boulder",
    "type": "resource",
    "location": {
      "coordinates": [
        9.864510147609728,
        52.31353631302643
      ]
    },
    "data": {
      "resource": {
        "itemId": "stone_block",
        "name": "Steinblock",
        "type": "material",
        "amount": 4,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock248",
    "title": "map.markers.fresh_bread",
    "type": "resource",
    "location": {
      "coordinates": [
        10.03070525188611,
        52.680115055786814
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock249",
    "title": "map.markers.dead_animal",
    "type": "resource",
    "location": {
      "coordinates": [
        9.833108778536927,
        52.300940381443496
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock250",
    "title": "map.markers.flint_rock",
    "type": "resource",
    "location": {
      "coordinates": [
        9.951966626410504,
        52.13623882750553
      ]
    },
    "data": {
      "resource": {
        "itemId": "flint",
        "name": "Feuerstein",
        "type": "material",
        "amount": 1,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock251",
    "title": "map.markers.cold_campfire",
    "type": "cold_campfire",
    "location": {
      "coordinates": [
        9.952966626410504,
        52.13723882750553
      ]
    },
    "data": {}
  },
  {
    "id": "mock252",
    "title": "map.markers.salt_deposit",
    "type": "resource",
    "location": {
      "coordinates": [
        9.296303634889961,
        52.138495901685815
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2,
        "maxGathers": 3
      }
    }
  },
  {
    "id": "mock253",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.794476278885007,
        52.36759494972247
      ]
    },
    "data": {}
  },
  {
    "id": "mock254",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.722858569237237,
        52.39898803705407
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock255",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.680210208216163,
        52.39061769644469
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock256",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.797152138876724,
        52.40027999468186
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock257",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.751003799148801,
        52.375822049183974
      ]
    },
    "data": {}
  },
  {
    "id": "mock258",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.779847746516161,
        52.398312626459386
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock259",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.69932609088487,
        52.38723230437941
      ]
    },
    "data": {}
  },
  {
    "id": "mock260",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.78415897717554,
        52.35178617368149
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock261",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.788432582831327,
        52.3801537479813
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock262",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.73966725879066,
        52.35406781267369
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock263",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.763347955275385,
        52.37484805052769
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock264",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.715431905925639,
        52.38628994436318
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock265",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.703619561427411,
        52.37344981298017
      ]
    },
    "data": {}
  },
  {
    "id": "mock266",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.69751103881352,
        52.345754013782745
      ]
    },
    "data": {}
  },
  {
    "id": "mock267",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.765170287426383,
        52.36444085331138
      ]
    },
    "data": {}
  },
  {
    "id": "mock268",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.741704509455666,
        52.35404962645881
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock269",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.709739820810151,
        52.36704629537353
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock270",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.713247521955033,
        52.36438545057777
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock271",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.687632763645498,
        52.40838388035755
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock272",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.713375540192317,
        52.3479405622805
      ]
    },
    "data": {}
  },
  {
    "id": "mock273",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.686784845608639,
        52.390707207754204
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock274",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.711368079336445,
        52.36966136370955
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock275",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.693147991374122,
        52.366575167299146
      ]
    },
    "data": {}
  },
  {
    "id": "mock276",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.726372550580558,
        52.40324985994566
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock277",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.77245856916433,
        52.385847187414804
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock278",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.761464283486651,
        52.35306577748093
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock279",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.730581780634068,
        52.40953717201007
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock280",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.759220598172206,
        52.358864621810284
      ]
    },
    "data": {}
  },
  {
    "id": "mock281",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.796187185525428,
        52.36473798215361
      ]
    },
    "data": {}
  },
  {
    "id": "mock282",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.75628976015786,
        52.35913107750155
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock283",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.720866652328043,
        52.3907375245367
      ]
    },
    "data": {}
  },
  {
    "id": "mock284",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.740552693368457,
        52.360841363968476
      ]
    },
    "data": {}
  },
  {
    "id": "mock285",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.743095105518268,
        52.36758764451699
      ]
    },
    "data": {}
  },
  {
    "id": "mock286",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.794257751651058,
        52.35258805480754
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock287",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.76104161062042,
        52.36075554023487
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock288",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.799012770001616,
        52.3519674736692
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock289",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.742429020084378,
        52.36060183887555
      ]
    },
    "data": {}
  },
  {
    "id": "mock290",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.708333359715407,
        52.385248419919
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock291",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.75852852206942,
        52.3554043649371
      ]
    },
    "data": {}
  },
  {
    "id": "mock292",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.75283148211747,
        52.354915082453296
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock293",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.759184117200922,
        52.37205327329655
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock294",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.799912352697397,
        52.359063762074896
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock295",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.710020666428047,
        52.350309117849406
      ]
    },
    "data": {}
  },
  {
    "id": "mock296",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.708001263290093,
        52.40256219560866
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock297",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.697652477228694,
        52.3501055146468
      ]
    },
    "data": {}
  },
  {
    "id": "mock298",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.701750584052718,
        52.3852889331292
      ]
    },
    "data": {}
  },
  {
    "id": "mock299",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.687563743549607,
        52.40889181900535
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock300",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.701278129815796,
        52.38085923794995
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock301",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.72519700032063,
        52.40818037547671
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock302",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.76641520833802,
        52.364601297580904
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock303",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.798791829949202,
        52.3548795396378
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock304",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.764950792185653,
        52.353840256963444
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock305",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.70155836995052,
        52.3954373856878
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock306",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.769829126215908,
        52.37617776781332
      ]
    },
    "data": {}
  },
  {
    "id": "mock307",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.706710477540204,
        52.35605747851569
      ]
    },
    "data": {}
  },
  {
    "id": "mock308",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.725667053990877,
        52.39856183430658
      ]
    },
    "data": {}
  },
  {
    "id": "mock309",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.796437699629024,
        52.36408209876522
      ]
    },
    "data": {}
  },
  {
    "id": "mock310",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.752060611337011,
        52.34024007187632
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock311",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.722583397225542,
        52.39046757282872
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock312",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.699752512730964,
        52.39642195697019
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock313",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.770942462548577,
        52.38437488608779
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock314",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.731246600679436,
        52.40314517235916
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock315",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.76821527768929,
        52.37685104335967
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock316",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.69362198589768,
        52.40085364206445
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock317",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.703595930995602,
        52.36071342375839
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock318",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.680788702794223,
        52.359994356632725
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock319",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.767931112333152,
        52.3729156089683
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock320",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.738507899961224,
        52.402807869689816
      ]
    },
    "data": {}
  },
  {
    "id": "mock321",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.730030775608489,
        52.36729607030396
      ]
    },
    "data": {}
  },
  {
    "id": "mock322",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.797337799176319,
        52.37967047879368
      ]
    },
    "data": {}
  },
  {
    "id": "mock323",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.77637353535365,
        52.34061752063708
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock324",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.799785003022482,
        52.358961113585416
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock325",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.745079128277341,
        52.39018442243521
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock326",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.72058077435853,
        52.40079935412014
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock327",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.722392406001815,
        52.39751710856363
      ]
    },
    "data": {}
  },
  {
    "id": "mock328",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.7370914199311,
        52.351588345040845
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock329",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.776532000946252,
        52.341741689018676
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock330",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.775587680032968,
        52.38024315122177
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock331",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.719258720159425,
        52.35792348683764
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock332",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.693461368344526,
        52.40212306624229
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock333",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.697501895027937,
        52.36934367713858
      ]
    },
    "data": {}
  },
  {
    "id": "mock334",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.763971707629105,
        52.39589438229849
      ]
    },
    "data": {}
  },
  {
    "id": "mock335",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.69480474685526,
        52.40805232434721
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock336",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.71589864979886,
        52.40945635239413
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock337",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.750652325206428,
        52.37803356989044
      ]
    },
    "data": {}
  },
  {
    "id": "mock338",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.73744212952555,
        52.406187267678746
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock339",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.720994978830419,
        52.37492292340447
      ]
    },
    "data": {}
  },
  {
    "id": "mock340",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.718311243159555,
        52.39037450721695
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock341",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.706630783419785,
        52.38840360822831
      ]
    },
    "data": {}
  },
  {
    "id": "mock342",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.709181112928828,
        52.37122856354166
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock343",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.703404737215225,
        52.35212807680926
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock344",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.753623233818937,
        52.38479815498536
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock345",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.788151597041638,
        52.36756117986248
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock346",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.775063384276319,
        52.40749822492401
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock347",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.691859180862942,
        52.37591558764786
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock348",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773026844592751,
        52.39997713934799
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock349",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.716828732633807,
        52.35603659309487
      ]
    },
    "data": {}
  },
  {
    "id": "mock350",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.757547878995307,
        52.38244695806093
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock351",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.721120090814889,
        52.37704522334697
      ]
    },
    "data": {}
  },
  {
    "id": "mock352",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.792418250999457,
        52.38136785492344
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock353",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.740813276870483,
        52.365001465208344
      ]
    },
    "data": {}
  },
  {
    "id": "mock354",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.759964546169401,
        52.365940146332086
      ]
    },
    "data": {}
  },
  {
    "id": "mock355",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.738374366007736,
        52.35823360415284
      ]
    },
    "data": {}
  },
  {
    "id": "mock356",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.727166513639212,
        52.369561129704245
      ]
    },
    "data": {}
  },
  {
    "id": "mock357",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.754337105110114,
        52.37703711137057
      ]
    },
    "data": {}
  },
  {
    "id": "mock358",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.729349898469678,
        52.37341953884479
      ]
    },
    "data": {}
  },
  {
    "id": "mock359",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.702330881687848,
        52.37303113012496
      ]
    },
    "data": {}
  },
  {
    "id": "mock360",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.756237436236749,
        52.36709362540296
      ]
    },
    "data": {}
  },
  {
    "id": "mock361",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.707180842949526,
        52.372300157500284
      ]
    },
    "data": {}
  },
  {
    "id": "mock362",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.735494516103072,
        52.3675964327404
      ]
    },
    "data": {}
  },
  {
    "id": "mock363",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.750435580188414,
        52.38522245062055
      ]
    },
    "data": {}
  },
  {
    "id": "mock364",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.744517213432466,
        52.388081830426074
      ]
    },
    "data": {}
  },
  {
    "id": "mock365",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.742289237812674,
        52.35197159787637
      ]
    },
    "data": {}
  },
  {
    "id": "mock366",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.719098914847327,
        52.37351793668005
      ]
    },
    "data": {}
  },
  {
    "id": "mock367",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.734945781162752,
        52.35868893720225
      ]
    },
    "data": {}
  },
  {
    "id": "mock368",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.758281648566001,
        52.34936084840895
      ]
    },
    "data": {}
  },
  {
    "id": "mock369",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.75587181817566,
        52.39593833332512
      ]
    },
    "data": {}
  },
  {
    "id": "mock370",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.685036228055004,
        52.39149682007635
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock371",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.757855547079902,
        52.35908488791437
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock372",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.737403798584953,
        52.409970016884685
      ]
    },
    "data": {}
  },
  {
    "id": "mock373",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.697609824867156,
        52.377922768466874
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock374",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.739548178814365,
        52.367890549794325
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock375",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.705874937619404,
        52.34317971725041
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock376",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.748698917258048,
        52.386396957265404
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock377",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.722794221147062,
        52.400234817256724
      ]
    },
    "data": {}
  },
  {
    "id": "mock378",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.720477374141991,
        52.379673502903714
      ]
    },
    "data": {}
  },
  {
    "id": "mock379",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.750847256999874,
        52.38972077346733
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock380",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.686986468208362,
        52.3515302110119
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock381",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.765769455018827,
        52.386424411637265
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock382",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.739061635955641,
        52.35161194323183
      ]
    },
    "data": {}
  },
  {
    "id": "mock383",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.705641105297047,
        52.39265259673296
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock384",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.785964041099797,
        52.39620405022828
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock385",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.750335260147155,
        52.344854044690024
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock386",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.765253934833785,
        52.35179612303595
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock387",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.696611238969895,
        52.39282109774847
      ]
    },
    "data": {}
  },
  {
    "id": "mock388",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.713105477448618,
        52.35526136754711
      ]
    },
    "data": {}
  },
  {
    "id": "mock389",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.774702260261764,
        52.361921352147554
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock390",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.794069952874173,
        52.36514829049509
      ]
    },
    "data": {}
  },
  {
    "id": "mock391",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.757253838216569,
        52.35215764441201
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock392",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.688487269801785,
        52.34088347825217
      ]
    },
    "data": {}
  },
  {
    "id": "mock393",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.742852593339322,
        52.369767761042226
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock394",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773899720113924,
        52.383481797045086
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock395",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.709753332059387,
        52.36792848827685
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock396",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.730764764412472,
        52.34210087875129
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock397",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.76113205679746,
        52.34512136248561
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock398",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.716379674219171,
        52.37075482610211
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock399",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.691312828059205,
        52.349539172047145
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock400",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.741423233516194,
        52.37951245436876
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock401",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.759269399144223,
        52.36182906621522
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock402",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.77613803269248,
        52.38251552332124
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock403",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.743306252459535,
        52.40383755867372
      ]
    },
    "data": {}
  },
  {
    "id": "mock404",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.786917403568532,
        52.34941758826836
      ]
    },
    "data": {}
  },
  {
    "id": "mock405",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.681416626923347,
        52.35543382692115
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock406",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.710217941484922,
        52.39509838872886
      ]
    },
    "data": {}
  },
  {
    "id": "mock407",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.717503955825093,
        52.34568320195315
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock408",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.744656700891193,
        52.40439675103088
      ]
    },
    "data": {}
  },
  {
    "id": "mock409",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.710874281097537,
        52.38980051346313
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock410",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.714338927207525,
        52.36613928382234
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock411",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.707622149041024,
        52.38254700130293
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock412",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.689695673799214,
        52.40741666428941
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock413",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.739675201809822,
        52.40830002407515
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock414",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.73217059270821,
        52.35423248578761
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock415",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.724731795030404,
        52.38082874614165
      ]
    },
    "data": {}
  },
  {
    "id": "mock416",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.715581337991246,
        52.34157706684642
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock417",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.798604068508574,
        52.377059807492934
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock418",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.726986497931938,
        52.35900865328836
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock419",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.779800261814254,
        52.345960105069665
      ]
    },
    "data": {}
  },
  {
    "id": "mock420",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.739326388799986,
        52.40918359914567
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock421",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.756098060914558,
        52.404696266140164
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock422",
    "title": "Straßenhändler",
    "type": "shop",
    "location": {
      "coordinates": [
        9.714476239072871,
        52.37942369189464
      ]
    },
    "data": {}
  },
  {
    "id": "mock423",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.76719378086897,
        52.35463187450587
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock424",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.724098394891989,
        52.370994538429514
      ]
    },
    "data": {}
  },
  {
    "id": "mock425",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.755865271430542,
        52.37748207564569
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock426",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.74908899695693,
        52.40749886476299
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock427",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.785147081367445,
        52.39341141938136
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock428",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.78314986828341,
        52.34947458142041
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock429",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.784876665049254,
        52.36218182845371
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock430",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.697423896580853,
        52.405378453165696
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock431",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.729507744127048,
        52.35296226847721
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock432",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.734942914385975,
        52.384859782065824
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock433",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.717055334584398,
        52.38295358363997
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock434",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.782183594290021,
        52.38589600091609
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock435",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.736536748059587,
        52.35000334054802
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock436",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.724003882951564,
        52.37107814755734
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock437",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.754717648470413,
        52.40811093962113
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock438",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.69683943723271,
        52.39527227470813
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock439",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.7192130620666,
        52.37452466508078
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock440",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.719778078511812,
        52.36932545283876
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock441",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.781815609193687,
        52.37440487141068
      ]
    },
    "data": {}
  },
  {
    "id": "mock442",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.784387319169772,
        52.374569270105496
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock443",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.759341594034254,
        52.38586139191429
      ]
    },
    "data": {}
  },
  {
    "id": "mock444",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.721136173571919,
        52.39958334421886
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock445",
    "title": "Salzablagerung",
    "type": "resource",
    "location": {
      "coordinates": [
        9.688274631784479,
        52.384362786821015
      ]
    },
    "data": {
      "resource": {
        "itemId": "salt",
        "name": "Salz",
        "type": "material",
        "amount": 2
      }
    }
  },
  {
    "id": "mock446",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.771737901192894,
        52.400072270077
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock447",
    "title": "Rest vom Festmahl",
    "type": "resource",
    "location": {
      "coordinates": [
        9.71789506330297,
        52.374539921147495
      ]
    },
    "data": {
      "resource": {
        "itemId": "roasted_meat",
        "name": "Gebratenes Fleisch",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock448",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773259331565093,
        52.359350326778625
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock449",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.7755735022242,
        52.382812037271684
      ]
    },
    "data": {}
  },
  {
    "id": "mock450",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.70239589472802,
        52.3560777974527
      ]
    },
    "data": {}
  },
  {
    "id": "mock451",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.685609610956673,
        52.40957979675611
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock452",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.701683256787422,
        52.35488757249468
      ]
    },
    "data": {}
  },
  {
    "id": "mock453",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.773307040226527,
        52.36083229123617
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock454",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.680001075225093,
        52.36483097568191
      ]
    },
    "data": {}
  },
  {
    "id": "mock455",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.742603687944216,
        52.34893764200527
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock456",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.68549610636534,
        52.38886548652849
      ]
    },
    "data": {}
  },
  {
    "id": "mock457",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.71337009735545,
        52.39278504135201
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock458",
    "title": "Bettler aus der Südstadt",
    "type": "npc",
    "location": {
      "coordinates": [
        9.707724946680832,
        52.36160458849564
      ]
    },
    "data": {
      "dialog": {
        "start": {
          "text": "map.dialogs.beggar.start",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_tell_more",
              "next": "ask_trade"
            },
            {
              "label": "map.dialogs.beggar.opt_no_time",
              "next": "end"
            }
          ]
        },
        "ask_trade": {
          "text": "map.dialogs.beggar.ask_trade",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_help",
              "next": "accept_quest"
            },
            {
              "label": "map.dialogs.beggar.opt_no_thanks",
              "next": "end"
            }
          ]
        },
        "accept_quest": {
          "text": "map.dialogs.beggar.accept_quest",
          "action": "trade_bread",
          "options": [
            {
              "label": "map.dialogs.beggar.opt_farewell",
              "next": "end"
            }
          ]
        }
      }
    }
  },
  {
    "id": "mock459",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.71601888154993,
        52.397155745812576
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock460",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.72342808354762,
        52.35792732794325
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock461",
    "title": "Stadtpilze",
    "type": "resource",
    "location": {
      "coordinates": [
        9.783737565342495,
        52.40223271566183
      ]
    },
    "data": {
      "resource": {
        "itemId": "mushrooms",
        "name": "Pilze",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock462",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.699997378411128,
        52.350465742046445
      ]
    },
    "data": {}
  },
  {
    "id": "mock463",
    "title": "Erlegtes Tier",
    "type": "resource",
    "location": {
      "coordinates": [
        9.682020568902312,
        52.408500832345055
      ]
    },
    "data": {
      "resource": {
        "itemId": "raw_meat",
        "name": "Rohes Fleisch",
        "type": "consumable",
        "amount": 2
      }
    }
  },
  {
    "id": "mock464",
    "title": "Erloschenes Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.680636448427538,
        52.40406093466111
      ]
    },
    "data": {}
  },
  {
    "id": "mock465",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.77917638977486,
        52.38343873903733
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock466",
    "title": "Versteckter Brunnen",
    "type": "resource",
    "location": {
      "coordinates": [
        9.747585242898715,
        52.407532342171365
      ]
    },
    "data": {
      "resource": {
        "itemId": "clean_water",
        "name": "Trinkwasser",
        "type": "consumable",
        "amount": 3
      }
    }
  },
  {
    "id": "mock467",
    "title": "Frisches Brot",
    "type": "resource",
    "location": {
      "coordinates": [
        9.705837633323826,
        52.38780994907726
      ]
    },
    "data": {
      "resource": {
        "itemId": "bread",
        "name": "Brot",
        "type": "consumable",
        "amount": 1
      }
    }
  },
  {
    "id": "mock468",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.708287122922838,
        52.36017264048265
      ]
    },
    "data": {}
  },
  {
    "id": "mock469",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.719293166549772,
        52.37537350507747
      ]
    },
    "data": {}
  },
  {
    "id": "mock470",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.70699007222099,
        52.38997512460509
      ]
    },
    "data": {}
  },
  {
    "id": "mock471",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.723897456152718,
        52.35338303356489
      ]
    },
    "data": {}
  },
  {
    "id": "mock472",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.737171053405346,
        52.36802552685863
      ]
    },
    "data": {}
  },
  {
    "id": "mock473",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.700475422882285,
        52.35777512670674
      ]
    },
    "data": {}
  },
  {
    "id": "mock474",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.738807691959279,
        52.387094600073844
      ]
    },
    "data": {}
  },
  {
    "id": "mock475",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.745276922263198,
        52.35106019099248
      ]
    },
    "data": {}
  },
  {
    "id": "mock476",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.752456727704516,
        52.35648160905364
      ]
    },
    "data": {}
  },
  {
    "id": "mock477",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.758019242318964,
        52.35221141250457
      ]
    },
    "data": {}
  },
  {
    "id": "mock478",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.70455516853355,
        52.38777478892547
      ]
    },
    "data": {}
  },
  {
    "id": "mock479",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.751362072644714,
        52.3885630171777
      ]
    },
    "data": {}
  },
  {
    "id": "mock480",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.748790197309926,
        52.35322112654301
      ]
    },
    "data": {}
  },
  {
    "id": "mock481",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.710241817953522,
        52.38348504501179
      ]
    },
    "data": {}
  },
  {
    "id": "mock482",
    "title": "Gemütliches Lagerfeuer",
    "type": "workbench",
    "location": {
      "coordinates": [
        9.754438064705576,
        52.3535527236892
      ]
    },
    "data": {}
  }
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // meters
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

let generatedChests: any[] = [];
let lastChestGenTime = 0;

export class QuestEngine {
  static generateRandomChests(lat: number, lon: number) {
    const now = Date.now();
    // Only regenerate every 10 minutes (600,000 ms) or if empty
    if (generatedChests.length > 0 && now - lastChestGenTime < 600000) return;

    generatedChests = [];
    lastChestGenTime = now;

    const numChests = Math.floor(Math.random() * 3) + 3; // 3 to 5 chests

    for (let i = 0; i < numChests; i++) {
      // random offset approx 100m to 500m
      const r = 100 + Math.random() * 400; // distance in meters
      const theta = Math.random() * 2 * Math.PI; // angle

      const latOffset = (r * Math.cos(theta)) / 111000;
      const lonOffset = (r * Math.sin(theta)) / (111000 * Math.cos(lat * Math.PI / 180));

      const cLat = lat + latOffset;
      const cLon = lon + lonOffset;

      generatedChests.push({
        id: `chest_${now}_${i}`,
        title: 'Verborgene Truhe',
        type: 'chest',
        location: { coordinates: [cLon, cLat] },
        data: {
          isLocked: Math.random() > 0.5 // 50% chance to be locked
        }
      });
    }
  }

  static removeChest(chestId: string) {
    generatedChests = generatedChests.filter(c => c.id !== chestId);
  }

  static injectDefaultGathers(q: any) {
    if (q.type === 'resource' && q.data?.resource) {
      if (typeof q.data.resource.maxGathers === 'undefined') {
        switch (q.data.resource.itemId) {
          case 'wood_log': q.data.resource.maxGathers = 5; break;
          case 'berries': q.data.resource.maxGathers = 4; break;
          case 'mushrooms': q.data.resource.maxGathers = 3; break;
          case 'iron_ore': q.data.resource.maxGathers = 4; break;
          case 'clean_water': q.data.resource.maxGathers = 10; break;
          case 'salt': q.data.resource.maxGathers = 5; break;
          case 'herb_root': q.data.resource.maxGathers = 2; break;
          default: q.data.resource.maxGathers = 3; break;
        }
      }
    }
    return q;
  }

  static isSeedingOsm = false;
  static lastOsmSeedTime = 0;

  /**
   * Checkt die Datenbank nach Quests im Umkreis des Users.
   * Wird idealerweise getriggert, wenn useLocation.ts neue Koordinaten liefert.
   */
  static async fetchAndSeedOSM(longitude: number, latitude: number) {
    if (this.isSeedingOsm) return [];
    const now = Date.now();
    if (now - this.lastOsmSeedTime < 60000) {
      console.log("[QuestEngine] OSM fetch on cooldown. Skipping.");
      return [];
    }

    this.isSeedingOsm = true;
    this.lastOsmSeedTime = now;

    try {
      const keys = Object.keys(osmMapping);
      const grouped: Record<string, string[]> = {};
      keys.forEach(tag => {
        const [k, v] = tag.split('=');
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(v);
      });

      let queryBody = '';
      for (const [k, values] of Object.entries(grouped)) {
        if (values.length === 1) {
          queryBody += `nwr["${k}"="${values[0]}"](around:400,${latitude},${longitude});`;
        } else {
          queryBody += `nwr["${k}"~"^(${values.join('|')})$"](around:400,${latitude},${longitude});`;
        }
      }

      const query = `[out:json][timeout:10];(${queryBody});out center;`;
      
      const endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://lz4.overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter'
      ];

      let responseText = null;
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log(`[QuestEngine] Sending GET to ${endpoint} with radius 400m`);
          const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`);
          if (response.ok) {
            responseText = await response.text();
            success = true;
            break;
          }
        } catch (e) {
          console.warn(`[QuestEngine] ${endpoint} failed:`, e.message || e);
        }
      }

      if (!success || !responseText) {
        console.error("[QuestEngine] All Overpass API endpoints failed.");
        return [];
      }
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("[QuestEngine] Overpass API returned non-JSON. Error page content:", responseText.substring(0, 500));
        return [];
      }
      console.log(`[QuestEngine] Overpass API response received. Elements count:`, data?.elements?.length);

      if (!data || !data.elements) return [];

      const newNodes: any[] = [];
      const localQuests: any[] = [];

      data.elements.forEach((el: any) => {
        if (!el.tags) return;

        let matchedMapping = null;
        for (const tag of keys) {
          const [k, v] = tag.split('=');
          if (el.tags[k] === v) {
            matchedMapping = (osmMapping as any)[tag];
            break;
          }
        }

        if (!matchedMapping) return;

        const osmId = el.type + '_' + el.id;

        // Apply spawn chance deterministically to prevent map clutter and randomization on refetch
        const chance = matchedMapping.spawnChance !== undefined ? matchedMapping.spawnChance : 1.0;
        
        // Simple hash of osmId to a float between 0 and 1
        let hash = 0;
        for (let i = 0; i < osmId.length; i++) {
          hash = Math.imul(31, hash) + osmId.charCodeAt(i) | 0;
        }
        const seededRandom = Math.abs(hash) / 2147483647; // Max 32bit int
        
        if (seededRandom > chance) return;

        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) return;

        let formattedData: any = { ...matchedMapping };
        if (matchedMapping.type === 'resource') {
          formattedData = { 
            resource: { 
              itemId: matchedMapping.itemId, 
              name: matchedMapping.title || matchedMapping.name, 
              type: matchedMapping.itemId === 'clean_water' || matchedMapping.itemId === 'dirty_water' ? 'consumable' : 'material', 
              minAmount: matchedMapping.amount?.[0] || 1, 
              maxAmount: matchedMapping.amount?.[1] || 3,
              maxGathers: 5 
            } 
          };
        } else if (matchedMapping.type === 'npc') {
          const baseKey = matchedMapping.dialogStart || "map.dialogs.trader";
          
          let questRequirement = { itemId: 'copper_coins', amount: 15 };
          let xpReward = 50;
          let rewardItem = null;
          
          if (baseKey.includes('garrosh')) { questRequirement = { itemId: 'iron_ore', amount: 3 }; xpReward = 100; rewardItem = 'sword'; }
          else if (baseKey.includes('alkuin')) { questRequirement = { itemId: 'mushrooms', amount: 3 }; xpReward = 100; rewardItem = 'healing_potion'; }
          else if (baseKey.includes('leif')) { questRequirement = { itemId: 'wood_log', amount: 5 }; xpReward = 150; rewardItem = 'copper_coins'; }
          else if (baseKey.includes('beggar')) { questRequirement = { itemId: 'bread', amount: 1 }; xpReward = 50; }
          else if (baseKey.includes('barista')) { questRequirement = { itemId: 'clean_water', amount: 1 }; xpReward = 75; rewardItem = 'coffee'; }
          else if (baseKey.includes('trader')) { questRequirement = { itemId: 'copper_coins', amount: 10 }; xpReward = 50; rewardItem = 'tool'; }
          else if (baseKey.includes('informant')) { questRequirement = { itemId: 'copper_coins', amount: 15 }; xpReward = 50; rewardItem = 'treasure_map'; }

          formattedData = { 
            dialog: { 
              start: { 
                text: `${baseKey}.start`, 
                options: [
                  { label: `${baseKey}.opt_tell_more`, next: "ask_trade" },
                  { label: `${baseKey}.opt_no_time`, next: "end" }
                ] 
              },
              ask_trade: {
                text: `${baseKey}.ask_trade`,
                options: [
                  { label: `${baseKey}.opt_help`, next: "accept_quest" },
                  { label: `${baseKey}.opt_no_thanks`, next: "end" }
                ]
              },
              accept_quest: {
                text: `${baseKey}.accept_quest`,
                action: "give_quest",
                questRequirement,
                xpReward,
                rewardItem,
                questTitle: `${baseKey}.quest_title`,
                questDesc: `${baseKey}.quest_desc`,
                options: [{ label: `${baseKey}.opt_farewell`, next: "end" }]
              },
              check_quest_progress: {
                text: `${baseKey}.check_quest_progress`,
                options: [
                  { label: "map.dialogs.common.give_items", next: "complete_quest" },
                  { label: "map.dialogs.common.not_yet", next: "end" }
                ]
              },
              complete_quest: {
                text: `${baseKey}.complete_quest`,
                action: "finish_quest",
                questRequirement,
                xpReward,
                rewardItem,
                options: [{ label: "map.dialogs.common.you_are_welcome", next: "end" }]
              },
              quest_already_completed: {
                text: `${baseKey}.quest_already_completed`,
                options: [{ label: `${baseKey}.opt_farewell`, next: "end" }]
              }
            } 
          };
        } else if (matchedMapping.type === 'chest') {
          formattedData = { lootPool: matchedMapping.lootPool, isLocked: matchedMapping.isLocked };
        }

        newNodes.push({
          osm_id: osmId,
          title: matchedMapping.title || matchedMapping.name || "Unbekannter Ort",
          type: matchedMapping.type,
          location: `POINT(${lon} ${lat})`,
          data: formattedData
        });

        localQuests.push({
          id: osmId,
          title: matchedMapping.title || matchedMapping.name || "Unbekannter Ort",
          type: matchedMapping.type,
          distance_meters: getDistance(latitude, longitude, lat, lon),
          location: { type: 'Point', coordinates: [lon, lat] },
          data: formattedData
        });
      });

      console.log(`[QuestEngine] Mapped ${newNodes.length} nodes from Overpass elements.`);

      if (newNodes.length > 0) {
        console.log(`[QuestEngine] Upserting ${newNodes.length} nodes to Supabase 'world_nodes'...`);
        supabase.from('world_nodes').upsert(newNodes, { onConflict: 'osm_id' })
          .then(({ error }) => {
            if (error) console.error("[QuestEngine] OSM Sync Error in Supabase:", error);
            else console.log("[QuestEngine] Successfully seeded Supabase with new OSM nodes!");
          });
      }

      return localQuests;
    } catch (e) {
      console.error("fetchAndSeedOSM error", e);
      return [];
    } finally {
      this.isSeedingOsm = false;
    }
  }

  static mockEnvironmentCache: any[] = [];
  static mockEnvironmentCenter = { lat: 0, lon: 0 };

  static generateRichMockEnvironment(latitude: number, longitude: number) {
    if (this.mockEnvironmentCache.length > 0) {
      const dist = getDistance(this.mockEnvironmentCenter.lat, this.mockEnvironmentCenter.lon, latitude, longitude);
      if (dist < 200) {
        return this.mockEnvironmentCache;
      }
    }

    const nodes = [];
    const now = Date.now();
    // Generiere 30 zufällige Nodes in der Nähe
    const types = ['tree', 'rock', 'water', 'npc', 'campfire'];
    for (let i = 0; i < 30; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.008; // ca. 400m
      const offsetLon = (Math.random() - 0.5) * 0.008;
      const t = types[Math.floor(Math.random() * types.length)];
      
      let qType = 'resource';
      let title = "Ressource";
      let itemId = "wood_log";

      if (t === 'tree') { title = "Baum"; itemId = "wood_log"; }
      else if (t === 'rock') { title = "Fels"; itemId = "stone_block"; }
      else if (t === 'water') { title = "Wasserquelle"; itemId = "clean_water"; }
      else if (t === 'npc') { qType = 'npc'; title = "Einsamer Wanderer"; }
      else if (t === 'campfire') { qType = 'cold_campfire'; title = "map.markers.campfire"; }

      let itemType = 'material';
      if (itemId === 'clean_water') itemType = 'consumable';

      nodes.push({
        id: `offline_mock_${now}_${i}`,
        title: title,
        type: qType,
        location: { type: 'Point', coordinates: [longitude + offsetLon, latitude + offsetLat] },
        data: qType === 'resource' ? { resource: { itemId, name: title, type: itemType, amount: 1, maxGathers: 5 } } : { name: title }
      });
    }
    
    this.mockEnvironmentCache = nodes;
    this.mockEnvironmentCenter = { lat: latitude, lon: longitude };
    
    return nodes;
  }

  static async checkNearbyQuests(longitude: number, latitude: number): Promise<QuestResponse[]> {
    try {
      // Supabase RPC Call für unsere PostGIS Funktion (5km Radius)
      const { data, error } = await supabase.rpc('get_nearby_quests', {
        p_longitude: longitude,
        p_latitude: latitude,
        p_radius_meters: 5000
      });

      if (error) {
        console.error('Error fetching nearby quests:', error);

        // Fallback Mock-Daten, falls Supabase das Quota-Limit erreicht hat
        if (error.message?.includes('restricted') || error.message?.includes('quota')) {
          console.warn("Using offline mock data due to Supabase Quota!");
          this.generateRandomChests(latitude, longitude);
          let allData = [...MOCK_DB, ...generatedChests, ...this.generateRichMockEnvironment(latitude, longitude)];
          const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());
          return uniqueData.map(q => {
            const injectedQ = this.injectDefaultGathers(q);
            return {
              ...injectedQ,
              location: q.location,
              title: injectedQ.title || injectedQ.data?.title || injectedQ.data?.name || "Unbekannter Ort",
              distance_meters: q.location?.coordinates ? getDistance(latitude, longitude, q.location.coordinates[1], q.location.coordinates[0]) : 9999
            };
          }) as QuestResponse[];
        }

        return [];
      }

      this.generateRandomChests(latitude, longitude);
      let allData = [...(data || []), ...generatedChests];

      // If area is empty or barely populated, procedurally fetch from OSM to seed the DB
      if (!data || data.length < 20) {
        console.log(`[QuestEngine] Only ${data?.length || 0} quests found in DB within 5km. Triggering fetchAndSeedOSM...`);
        let osmGenerated = await this.fetchAndSeedOSM(longitude, latitude);
        
        // IF Overpass API failed or didn't find anything, generate a mock environment!
        if (osmGenerated.length === 0) {
            console.log("[QuestEngine] Overpass failed or returned 0. Generating rich mock offline environment!");
            osmGenerated = this.generateRichMockEnvironment(latitude, longitude);
        }
        
        console.log(`[QuestEngine] Procedural generation returned ${osmGenerated.length} quests.`);
        allData = [...allData, ...osmGenerated];
      } else {
        console.log(`[QuestEngine] Found ${data.length} quests in DB. Skipping OSM fetch.`);
      }

      console.log(`[QuestEngine] Total quests before deduplication: ${allData.length}`);
      const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());
      console.log(`[QuestEngine] Total unique quests returned to MapScreen: ${uniqueData.length}`);
      return uniqueData.map(q => {
        let qLoc = q.location;
        if (typeof qLoc === 'string') {
          try { qLoc = JSON.parse(qLoc); } catch (e) {}
        }
        
        let qLat = qLoc?.coordinates?.[1];
        let qLon = qLoc?.coordinates?.[0];
        if (qLoc?.type === 'Point' && Array.isArray(qLoc?.coordinates)) {
          // Supabase PostGIS format
          qLon = qLoc.coordinates[0];
          qLat = qLoc.coordinates[1];
        }
        
        const injectedQ = this.injectDefaultGathers(q);

        // Dynamic generation of quest lifecycle for all loaded NPCs (cached or mock)
        if (injectedQ.type === 'npc') {
          let startText = injectedQ.data?.dialog?.start?.text || injectedQ.data?.dialog?.text;
          if (startText) {
            // Some old caches just had 'map.dialogs.barista'
            if (!startText.endsWith('.start') && startText.startsWith('map.dialogs.')) {
              startText += '.start';
            }
            const baseKeyMatch = startText.match(/^(map\.dialogs\.[^.]+)/);
            if (baseKeyMatch) {
              const baseKey = baseKeyMatch[1];

              let questRequirement = { itemId: 'copper_coins', amount: 15 };
              let xpReward = 50;
              let rewardItem = null;

              if (baseKey.includes('garrosh')) { questRequirement = { itemId: 'iron_ore', amount: 3 }; xpReward = 100; rewardItem = 'sword'; }
              else if (baseKey.includes('alkuin')) { questRequirement = { itemId: 'mushrooms', amount: 3 }; xpReward = 100; rewardItem = 'healing_potion'; }
              else if (baseKey.includes('leif')) { questRequirement = { itemId: 'wood_log', amount: 5 }; xpReward = 150; rewardItem = 'copper_coins'; }
              else if (baseKey.includes('beggar')) { questRequirement = { itemId: 'bread', amount: 1 }; xpReward = 50; }
              else if (baseKey.includes('barista')) { questRequirement = { itemId: 'clean_water', amount: 1 }; xpReward = 75; rewardItem = 'coffee'; }
              else if (baseKey.includes('trader')) { questRequirement = { itemId: 'copper_coins', amount: 10 }; xpReward = 50; rewardItem = 'tool'; }
              else if (baseKey.includes('informant')) { questRequirement = { itemId: 'copper_coins', amount: 15 }; xpReward = 50; rewardItem = 'treasure_map'; }

              injectedQ.data.dialog = {
                start: { 
                  text: `${baseKey}.start`, 
                  options: [
                    { label: `${baseKey}.opt_tell_more`, next: "ask_trade" },
                    { label: `${baseKey}.opt_no_time`, next: "end" }
                  ] 
                },
                ask_trade: {
                  text: `${baseKey}.ask_trade`,
                  options: [
                    { label: `${baseKey}.opt_help`, next: "accept_quest" },
                    { label: `${baseKey}.opt_no_thanks`, next: "end" }
                  ]
                },
                accept_quest: {
                  text: `${baseKey}.accept_quest`,
                  action: "give_quest",
                  questRequirement,
                  xpReward,
                  rewardItem,
                  options: [{ label: `${baseKey}.opt_farewell`, next: "end" }]
                },
                check_quest_progress: {
                  text: `${baseKey}.check_quest_progress`,
                  options: [
                    { label: "map.dialogs.common.give_items", next: "complete_quest" },
                    { label: "map.dialogs.common.not_yet", next: "end" }
                  ]
                },
                complete_quest: {
                  text: `${baseKey}.complete_quest`,
                  action: "finish_quest",
                  questRequirement,
                  xpReward,
                  rewardItem,
                  options: [{ label: "map.dialogs.common.you_are_welcome", next: "end" }]
                },
                quest_already_completed: {
                  text: `${baseKey}.quest_already_completed`,
                  options: [{ label: `${baseKey}.opt_farewell`, next: "end" }]
                }
              };
            }
          }
        }

        // Backward compatibility for NPC names saved as "Unbekannter Ort"
        let finalTitle = injectedQ.title || injectedQ.data?.title || injectedQ.data?.name || "Unbekannter Ort";
        if (injectedQ.type === 'npc' && finalTitle === 'Unbekannter Ort') {
          const startText = injectedQ.data?.dialog?.start?.text;
          if (startText?.includes('barista')) finalTitle = 'map.markers.survivor_barista';
          else if (startText?.includes('trader')) finalTitle = 'map.markers.trader_bot';
          else if (startText?.includes('informant')) finalTitle = 'map.markers.drunk_informant';
        }

        return {
          ...injectedQ,
          location: qLoc, // <- OVERRIDE with parsed location
          title: finalTitle,
          distance_meters: (qLat !== undefined && qLon !== undefined)
            ? getDistance(latitude, longitude, qLat, qLon)
            : 9999
        };
      }) as QuestResponse[];
    } catch (err: any) {
      console.error('QuestEngine Error:', err);

      // Immer Fallback Mocks + Chests zurückgeben, wenn ein Fehler auftritt, damit das Spiel nicht leer ist
      this.generateRandomChests(latitude, longitude);
      const allData = [...MOCK_DB, ...generatedChests];
      const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());
      return uniqueData.map(q => {
        const injectedQ = this.injectDefaultGathers(q);
        return {
          ...injectedQ,
          distance_meters: getDistance(latitude, longitude, injectedQ.location.coordinates[1], injectedQ.location.coordinates[0])
        };
      }) as QuestResponse[];
    }
  }

  /**
   * Validiert und speichert die Bewegung beim Backend (Anti-Cheat).
   */
  static async recordMovement(longitude: number, latitude: number) {
    try {
      /*
      // Deaktiviert, bis Supabase Auth eingebaut ist, da es sonst alle 400ms einen 401 (non-2xx) wirft.
      const { data, error } = await supabase.functions.invoke('validate-movement', {
        body: { longitude, latitude }
      });

      if (error) {
        // console.warn suppressed to prevent YellowBox spam if Supabase isn't fully set up
        console.log('Movement validation failed or too fast:', error.message || error);
      } else {
        console.log('Movement recorded successfully:', data);
      }
      */
    } catch (err) {
      console.error('Movement Record Error:', err);
    }
  }
}
