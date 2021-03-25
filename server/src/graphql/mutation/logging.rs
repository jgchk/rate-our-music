use crate::model::log::{Log, LogEnvironment, LogLevel};
use async_graphql::*;
use serde::{Deserialize, Serialize};
pub struct LoggingMutation;

#[Object]
impl LoggingMutation {
    async fn errors(
        &self,
        ctx: &Context<'_>,
        scope: String,
        environment: LogEnvironment,
        errors: Vec<ErrorInput>,
    ) -> Result<Vec<Log>> {
        let env = ctx.data::<crate::graphql::Context>()?;

        let mut logs = Vec::new();
        for error in errors {
            let log = env
                .db()
                .log()
                .create(
                    &scope,
                    environment,
                    LogLevel::Error,
                    &error.message,
                    Some(&serde_json::to_string(&ErrorData {
                        name: error.name,
                        data: error.data,
                    })?),
                )
                .await?;
            logs.push(log);
        }

        Ok(logs)
    }
}

#[derive(InputObject)]
pub struct ErrorInput {
    message: String,
    name: String,
    data: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct ErrorData {
    name: String,
    data: Option<String>,
}
