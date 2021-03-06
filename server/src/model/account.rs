use async_graphql::SimpleObject;

#[derive(SimpleObject)]
pub struct Account {
    pub id: i64,
    pub username: String,
    #[graphql(skip)]
    pub password: String,
}

#[derive(SimpleObject)]
pub struct Auth {
    pub token: String,
    pub account: Account,
}
