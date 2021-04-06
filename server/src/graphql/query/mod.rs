mod account;
mod artist;
mod release;
mod track;

use account::AccountQuery;
use artist::ArtistQuery;
use async_graphql::*;
use release::ReleaseQuery;
use track::TrackQuery;

pub struct Query;

#[Object]
impl Query {
    async fn account(&self) -> AccountQuery {
        AccountQuery
    }

    async fn artist(&self) -> ArtistQuery {
        ArtistQuery
    }

    async fn release(&self) -> ReleaseQuery {
        ReleaseQuery
    }

    async fn track(&self) -> TrackQuery {
        TrackQuery
    }
}
