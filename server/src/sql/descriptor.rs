use crate::errors::Error;
use crate::model::descriptor::Descriptor;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct DescriptorDatabase<'a>(&'a PgPool);

impl<'a> DescriptorDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        name: &str,
        description: Option<&str>,
        parent_id: Option<i32>,
        is_graded: bool,
    ) -> Result<Descriptor, Error> {
        let descriptor = sqlx::query!(
            "INSERT INTO descriptor (descriptor_parent_id, descriptor_name, descriptor_description, descriptor_is_graded)
            VALUES ($1, $2, $3, $4)
            RETURNING descriptor_id",
            parent_id,
            name,
            description,
            is_graded
        )
        .fetch_one(self.0)
        .await?;
        Ok(Descriptor {
            descriptor_id: descriptor.descriptor_id,
            descriptor_parent_id: parent_id,
            descriptor_name: name.to_string(),
            descriptor_description: description.map(String::from),
            descriptor_is_graded: is_graded,
        })
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
