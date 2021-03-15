mod account;
mod artist;
mod release;

use account::AccountMutation;
use artist::ArtistMutation;
use async_graphql::*;
use release::ReleaseMutation;

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
}
