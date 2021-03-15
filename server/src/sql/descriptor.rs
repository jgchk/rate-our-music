use crate::errors::Error;
use crate::model::descriptor::Descriptor;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct DescriptorDatabase<'a>(&'a PgPool);

impl<'a> DescriptorDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Descriptor, Error> {
        sqlx::query_as!(
            Descriptor,
            "SELECT * FROM descriptor WHERE descriptor_id = $1",
            id
        )
        .fetch_one(self.0)
        .await
        .map_err(|e| e.into())
    }
}
