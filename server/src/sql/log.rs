use crate::{
    errors::Error,
    model::log::{Log, LogEnvironment, LogLevel},
};
use sqlx::PgPool;

#[derive(Debug, Clone)]
pub struct LogDatabase<'a>(&'a PgPool);

impl<'a> LogDatabase<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self(pool)
    }

    pub async fn create(
        &self,
        scope: &str,
        environment: LogEnvironment,
        level: LogLevel,
        message: &str,
        data: Option<&str>,
    ) -> Result<Log, Error> {
        let log = sqlx::query!(
            "INSERT INTO log (log_scope, log_environment, log_level, log_message, log_data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING log_id",
            scope,
            environment as _,
            level as _,
            message,
            data,
        )
        .fetch_one(self.0)
        .await?;
        Ok(Log {
            log_id: log.log_id,
            log_scope: scope.to_string(),
            log_environment: environment,
            log_level: level,
            log_message: message.to_string(),
            log_data: data.map(String::from),
        })
    }
}
