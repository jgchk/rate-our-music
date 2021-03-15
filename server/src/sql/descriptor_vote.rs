use crate::errors::Error;
use crate::model::descriptor_vote::DescriptorVote;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct DescriptorVoteDatabase<'a>(&'a PgPool);

impl<'a> DescriptorVoteDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        account_id: i32,
        release_id: i32,
        descriptor_id: i32,
        value: i16,
    ) -> Result<DescriptorVote, Error> {
        sqlx::query!(
            "INSERT INTO release_descriptor_vote (account_id, release_id, descriptor_id, release_descriptor_vote_value)
            VALUES ($1, $2, $3, $4)",
            account_id, release_id, descriptor_id, value,
        )
        .execute(self.0)
        .await?;
        Ok(DescriptorVote {
            account_id,
            release_id,
            descriptor_id,
            release_descriptor_vote_value: value,
        })
    }

    pub async fn get_by_release(&self, release_id: i32) -> Result<Vec<DescriptorVote>, Error> {
        sqlx::query_as!(
            DescriptorVote,
            "SELECT *
            FROM release_descriptor_vote
            WHERE release_id = $1",
            release_id
        )
        .fetch_all(self.0)
        .await
        .map_err(|e| e.into())
    }
}
