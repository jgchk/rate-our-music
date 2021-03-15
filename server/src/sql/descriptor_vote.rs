use crate::errors::Error;
use crate::model::descriptor_vote::DescriptorVote;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct DescriptorVoteDatabase<'a>(&'a PgPool);

impl<'a> DescriptorVoteDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
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
