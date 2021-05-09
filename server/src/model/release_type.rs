use async_graphql::SimpleObject;

#[derive(SimpleObject)]
pub struct ReleaseType {
    pub id: i32,
    pub name: String,
}
