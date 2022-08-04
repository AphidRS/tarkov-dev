import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import Icon from '@mdi/react';
import {mdiSunglasses} from '@mdi/js';

import DataTable from '../../../components/data-table';
import formatPrice from '../../../modules/format-price';
import { useItemsQuery } from '../../../features/items/queries';

const centerCell = ({ value }) => {
    return <div className="center-content">{value}</div>;
};

function Glasses(props) {
    const { data: items } = useItemsQuery();
    const { t } = useTranslation();

    const displayItems = useMemo(
        () => items.filter((item) => item.types.includes('glasses')),
        [items],
    );

    const columns = useMemo(
        () => [
            {
                accessor: 'image',
                Cell: ({ value }) => {
                    return (
                        <div className="center-content">
                            <img
                                alt=""
                                className="table-image"
                                height="64"
                                loading="lazy"
                                src={value}
                                width="64"
                            />
                        </div>
                    );
                },
            },
            {
                Header: t('Name'),
                accessor: 'name',
            },
            {
                Header: t('Armor class'),
                accessor: 'armorClass',
                Cell: centerCell,
            },
            {
                Header: t('Blindness protection'),
                accessor: 'blindness',
                Cell: centerCell,
            },
            {
                Header: ({ value }) => {
                    return (
                        <div className="center-content">
                            {t('Status')}
                            <div>{t('Turn/Ergo')}</div>
                        </div>
                    );
                },
                accessor: 'stats',
                Cell: centerCell,
            },
            {
                Header: t('Cost'),
                accessor: 'price',
                Cell: centerCell,
            },
        ],
        [t],
    );

    const data = useMemo(
        () =>
            displayItems
                .map((item) => {
                    const match = item.name.match(/(.*)\s\(\d.+?$/);
                    let itemName = item.name;

                    if (match) {
                        itemName = match[1].trim();
                    }

                    return {
                        name: itemName,
                        armorClass: item.itemProperties.armorClass,
                        blindness: `${
                            (item.itemProperties.BlindnessProtection || 0) * 100
                        }%`,
                        stats: `${item.itemProperties.mousePenalty || 0}% / ${
                            item.itemProperties.weaponErgonomicPenalty || 0
                        }`,
                        image:
                            item.iconLink ||
                            'https://tarkov.dev/images/unknown-item-icon.jpg',
                        price: `${formatPrice(item.avg24hPrice)}`,
                    };
                })
                .filter(Boolean),
        [displayItems],
    );

    return [
        <Helmet key={'glasses-table'}>
            <meta charSet="utf-8" />
            <title>{t('Escape from Tarkov')} - {t('Glasses chart')}</title>
            <meta
                name="description"
                content="All glasses in Escape from Tarkov sortable by price, armor class etc"
            />
        </Helmet>,
        <div className="display-wrapper" key={'display-wrapper'}>
            <div className="page-headline-wrapper">
                <h1>
                    {t('Escape from Tarkov')} 
                    <Icon path={mdiSunglasses} size={1.5} className="icon-with-text" /> 
                    {t('Glasses chart')}
                </h1>
            </div>

            <DataTable 
                columns={columns} 
                data={data} 
            />

            <div className="page-wrapper" style={{ minHeight: 0 }}>
                <p>
                    {"Eyewear in Escape from Tarkov can be used to decrease the number and quantity of raindrops on the players' screens as well as the length of flashbang effects."}
                </p>
            </div>
        </div>,
    ];
}

export default Glasses;
