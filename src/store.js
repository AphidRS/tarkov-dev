import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './features/items/itemsSlice';
import craftsReducer from './features/crafts/craftsSlice';
import bartersReducer from './features/barters/bartersSlice';
import hideoutReducer from './features/hideout/hideoutSlice';
import metaReducer from './features/meta/metaSlice';
import questsReducer from './features/quests/questsSlice';
import tradersReducer from './features/traders/tradersSlice';
import bossesReducer from './features/bosses/bossesSlice';
import mapsReducer from './features/maps/mapsSlice';
import socketsReducer from './features/sockets/socketsSlice';
import settingsReducer from './features/settings/settingsSlice';

export default configureStore({
    reducer: {
        items: itemsReducer,
        crafts: craftsReducer,
        barters: bartersReducer,
        hideout: hideoutReducer,
        meta: metaReducer,
        quests: questsReducer,
        traders: tradersReducer,
        bosses: bossesReducer,
        maps: mapsReducer,
        sockets: socketsReducer,
        settings: settingsReducer,
    },
});
