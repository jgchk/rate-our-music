use crate::errors::Error;
use crate::model::genre::Genre;
use crate::model::genre::GenreSum;
use crate::model::genre_vote::GenreVoteType;
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct GenreDatabase<'a>(&'a PgPool);

impl<'a> GenreDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn get(&self, id: i32) -> Result<Genre, Error> {
        sqlx::query_as!(Genre, "SELECT * FROM genre WHERE genre_id = $1", id)
            .fetch_one(self.0)
            .await
            .map_err(|e| e.into())
    }

    pub async fn get_by_release_and_vote_type(
        &self,
        release_id: i32,
        vote_type: GenreVoteType,
    ) -> Result<Vec<Genre>, Error> {
        let genre_sums = sqlx::query_as!(
            GenreSum,
            r#"SELECT *
            FROM genre
            WHERE genre_id IN (
                SELECT genre_id
                FROM release_genre_vote
                WHERE release_id = $1 AND release_genre_vote_type = $2
                GROUP BY genre_id, release_id, release_genre_vote_type
                ORDER BY SUM (release_genre_vote_value) DESC
            )"#,
            release_id,
            vote_type as GenreVoteType
        )
        .fetch_all(self.0)
        .await?;

        let mut genres = vec![];
        for genre_sum in genre_sums {
            if let (Some(genre_id), Some(genre_name)) = (genre_sum.genre_id, genre_sum.genre_name) {
                genres.push(Genre {
                    genre_id,
                    genre_parent_id: genre_sum.genre_parent_id,
                    genre_name,
                    genre_description: genre_sum.genre_description,
                })
            }
        }

        Ok(genres)
    }
}
