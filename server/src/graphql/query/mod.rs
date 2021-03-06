mod account;

use account::AccountQuery;
use async_graphql::*;

#[derive(MergedObject, Default)]
pub struct Query(AccountQuery);
