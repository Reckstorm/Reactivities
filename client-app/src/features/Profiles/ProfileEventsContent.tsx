import { observer } from "mobx-react-lite";
import { Grid, Header, Loader, Tab, TabPane, TabProps } from "semantic-ui-react";
import ProfileEventCards from "./ProfileEventCards";
import { useStore } from "../../app/stores/store";
import { useEffect, useState } from "react";
import { PagingParams } from "../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";

export default observer(function ProfileEventsContent() {
    const { profileStore } = useStore();
    const { userActivities, loadingActivities, loadUserActivities, profile, setPredicate, setPagingParams, pagination } = profileStore;
    const [loadingMore, setLoadingMore] = useState(false);

    const panes = [
        {
            menuItem: 'Future Events',
            render: () =>
                <TabPane className="innerTabPane" loading={loadingActivities && !loadingMore && userActivities.length === 0} active>
                    <ProfileEventCards userActivities={userActivities!} />
                </TabPane>,
            key: 'future'
        },
        {
            menuItem: 'Past Events',
            render: () =>
                <TabPane className="innerTabPane" loading={loadingActivities && !loadingMore && userActivities.length === 0}>
                    <ProfileEventCards userActivities={userActivities!} />
                </TabPane>,
            key: 'past'
        },
        {
            menuItem: 'Hosting',
            render: () =>
                <TabPane className="innerTabPane" loading={loadingActivities && !loadingMore && userActivities.length === 0}>
                    <ProfileEventCards userActivities={userActivities!} />
                </TabPane>,
            key: 'host'
        }];

    useEffect(() => {
        setPredicate('hostusername', profile!.username);
        setPredicate('predicate', 'future');
    }, [])

    function handleTabChange(data: TabProps) {
        setPredicate('predicate', panes[data.activeIndex as number].key);
    }

    function handleLoadingMore() {
        setLoadingMore(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, 12));
        loadUserActivities(profile!.username).then(() => {
            setLoadingMore(false);
        });
    }

    return (
        <TabPane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calendar' content={`Activities`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <InfiniteScroll
                        className='InfContainer'
                        pageStart={0}
                        loadMore={handleLoadingMore}
                        hasMore={!loadingMore && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                        threshold={-10}
                    >
                        <Tab
                            menu={{ secondary: true, pointing: true }}
                            panes={panes}
                            onTabChange={(_, data) => handleTabChange(data)}
                        >
                        </Tab>
                    </InfiniteScroll>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Loader active={loadingMore} style={{ paddingBottom: 40 }} />
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})