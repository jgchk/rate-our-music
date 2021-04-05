mod account;
mod artist;
mod logging;
mod release;
mod release_review;

use account::AccountMutation;
use artist::ArtistMutation;
use async_graphql::*;
use logging::LoggingMutation;
use release::ReleaseMutation;
use release_review::ReleaseReviewMutation;

pub struct Mutation;

#[Object]
impl Mutation {
    async fn account(&self) -> AccountMutation {
        AccountMutation
    }

    async fn artist(&self) -> ArtistMutation {
        ArtistMutation
    }

    async fn release(&self) -> ReleaseMutation {
        ReleaseMutation
    }

    async fn release_review(&self) -> ReleaseReviewMutation {
        ReleaseReviewMutation
    }

    async fn logging(&self) -> LoggingMutation {
        LoggingMutation
    }
}
