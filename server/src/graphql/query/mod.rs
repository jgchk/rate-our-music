mod account;
mod artist;
mod release;

use account::AccountQuery;
use artist::ArtistQuery;
use async_graphql::*;
use release::ReleaseQuery;

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
}
