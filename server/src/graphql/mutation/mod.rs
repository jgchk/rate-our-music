mod account;

use account::AccountMutation;
use async_graphql::*;

#[derive(MergedObject, Default)]
pub struct Mutation(AccountMutation);
