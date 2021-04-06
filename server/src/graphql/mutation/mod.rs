mod account;
mod artist;
mod logging;
mod release;
mod release_review;
mod track_review;

use account::AccountMutation;
use artist::ArtistMutation;
use async_graphql::*;
use logging::LoggingMutation;
use release::ReleaseMutation;
use release_review::ReleaseReviewMutation;
use track_review::TrackReviewMutation;

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

    async fn track_review(&self) -> TrackReviewMutation {
        TrackReviewMutation
    }

    async fn logging(&self) -> LoggingMutation {
        LoggingMutation
    }
}
