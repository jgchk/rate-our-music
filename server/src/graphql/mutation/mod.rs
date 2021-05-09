mod account;
mod artist;
mod release;
mod release_genre;
mod release_review;
mod releases;
mod track_review;

use account::AccountMutation;
use artist::ArtistMutation;
use async_graphql::*;
use release::ReleaseMutation;
use release_review::ReleaseReviewMutation;
use releases::ReleasesMutation;
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

    async fn release_review(&self) -> ReleaseReviewMutation {
        ReleaseReviewMutation
    }

    async fn track_review(&self) -> TrackReviewMutation {
        TrackReviewMutation
    }

    async fn releases(&self) -> ReleasesMutation {
        ReleasesMutation
    }

    async fn release(&self, id: i32) -> ReleaseMutation {
        ReleaseMutation { id }
    }
}
