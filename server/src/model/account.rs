use async_graphql::SimpleObject;

#[derive(SimpleObject)]
pub struct Account {
    pub id: i32,
    pub username: String,
    #[graphql(skip)]
    pub password: String,
}

#[derive(SimpleObject)]
pub struct Auth {
    pub token: String,
    pub exp: i64,
    pub account: Account,
}
