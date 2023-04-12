import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import { useQuery } from 'react-query';

import doFetchBarters from './do-fetch-barters';
import { langCode } from '../../modules/lang-helpers';
import { useItemsData } from '../items/itemsSlice';
import { useQuestsData } from '../quests/questsSlice';

import { placeholderBarters } from '../../modules/placeholder-data';

export const useBartersQuery = (queryOptions) => {
    const bartersQuery = useQuery('barters', () => doFetchBarters(langCode()), {
        refetchInterval: 600000,
        placeholderData: placeholderBarters(langCode()),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...queryOptions,
    });

    return bartersQuery;
};

const initialState = {
    data: placeholderBarters(langCode()),
    status: 'idle',
    error: null,
};

export const fetchBarters = createAsyncThunk('barters/fetchBarters', () =>
    doFetchBarters(langCode())
);

const bartersSlice = createSlice({
    name: 'barters',
    initialState,
    reducers: {
        toggleItem: (state, action) => {
            let newBarters = [...state.data];

            newBarters = newBarters.map((barter) => {
                barter.requiredItems = barter.requiredItems.map(
                    (requiredItem) => {
                        if (requiredItem.item.id === action.payload.itemId) {
                            if (requiredItem.count === 0) {
                                requiredItem.count = requiredItem.originalCount;
                            } else {
                                requiredItem.originalCount = requiredItem.count;
                                requiredItem.count = 0;
                            }
                        }

                        return requiredItem;
                    },
                );

                return barter;
            });

            state.data = newBarters;
        },
        setItemCost: (state, action) => {
            let newBarters = [...state.data];

            newBarters = newBarters.map((barter) => {
                barter.requiredItems = barter.requiredItems.map(
                    (requiredItem) => {
                        if (requiredItem.item.id === action.payload.itemId) {
                            requiredItem.priceCustom = action.payload.price;
                        }

                        return requiredItem;
                    },
                );

                return barter;
            });

            state.data = newBarters;
        },
        setRewardValue: (state, action) => {
            let newBarters = [...state.data];

            newBarters = newBarters.map((barter) => {
                barter.rewardItems = barter.rewardItems.map(
                    (rewardItem) => {
                        if (rewardItem.item.id === action.payload.itemId) {
                            rewardItem.priceCustom = action.payload.price;
                        }

                        return rewardItem;
                    },
                );

                return barter;
            });

            state.data = newBarters;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBarters.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(fetchBarters.fulfilled, (state, action) => {
            state.status = 'succeeded';

            if (!equal(state.data, action.payload)) {
                state.data = action.payload;
            }
        });
        builder.addCase(fetchBarters.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { toggleItem, setItemCost, setRewardValue } = bartersSlice.actions;

export default bartersSlice.reducer;

export const selectAllBarters = (state) => {
    return state.barters.data.map(barter => {
        let taskUnlock = barter.taskUnlock;
        if (taskUnlock) {
            taskUnlock = state.quests.data.find(t => t.id === taskUnlock.id);
        }
        return {
            ...barter,
            requiredItems: barter.requiredItems.map(req => {
                let matchedItem = state.items.data.find(it => it.id === req.item.id);
                if (!matchedItem) {
                    return false;
                }
                return {
                    ...req,
                    item: matchedItem,
                };
            }).filter(Boolean),
            rewardItems: barter.rewardItems.map(req => {
                const matchedItem = state.items.data.find(it => it.id === req.item.id);
                if (!matchedItem) {
                    return false;
                }
                return {
                    ...req,
                    item: matchedItem,
                };
            }).filter(Boolean),
            taskUnlock: taskUnlock,
        };
    }).filter(barter => barter.rewardItems.length > 0 && barter.requiredItems.length > 0);
};

let isFetchingData = false;

export const useBartersData = () => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.barters);
    const data = useSelector(selectAllBarters);
    const intervalRef = useRef(false);
    useItemsData();
    useQuestsData();
    useEffect(() => {
        if (!isFetchingData) {
            isFetchingData = true;
            dispatch(fetchBarters());
            intervalRef.current = setInterval(() => {
                dispatch(fetchBarters());
            }, 600000);
        }
        return () => clearInterval(intervalRef.current);
    }, [dispatch]);
    
    return { data, status, error };
};
