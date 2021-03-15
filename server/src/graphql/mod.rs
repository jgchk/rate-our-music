mod context;
mod guards;
mod mutation;
mod query;

use async_graphql::EmptySubscription;
pub use context::Context;
use mutation::Mutation;
use query::Query;

pub type Schema = async_graphql::Schema<Query, Mutation, EmptySubscription>;
pub fn schema() -> Schema {
    async_graphql::Schema::new(Query, Mutation, EmptySubscription)
}
