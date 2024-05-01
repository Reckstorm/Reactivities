import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry.size]);

    function handleLoadingMore() {
        setLoadingMore(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => {
            setLoadingMore(false);
            const temp = document.getElementsByClassName('ActivityItem');
            const tempEl = temp[temp.length - (pagination!.itemsPerPage * 2)];
            const tempCont = document.getElementsByClassName('InfContainer')[0];
            tempEl.scrollIntoView(true);
            const scrollValue =  tempCont.scrollHeight - (tempEl.scrollHeight * (pagination!.itemsPerPage * 2) + 112);
            scrollTo(0, scrollValue);
        });
    }

    return (
        <Grid>
            <GridColumn width='10'>
                {activityStore.loadingInitial && activityRegistry.size === 0 && !loadingMore ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        className='InfContainer'
                        pageStart={0}
                        loadMore={handleLoadingMore}
                        hasMore={!loadingMore && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                        threshold={-40}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </GridColumn>
            <Grid.Column width='6'>
                <ActivityFilters></ActivityFilters>
            </Grid.Column>
            <GridColumn width='10'>
                <Loader active={loadingMore} />
            </GridColumn>
        </Grid>
    )
})