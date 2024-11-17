library(tidyverse)

read_type <- function(type) {
  list.files(path = "../data", recursive = TRUE, pattern = paste0("_", type, "\\.csv$"), full.names = TRUE) %>%
    map_df(\(x) read_csv(x) %>% mutate(participant_id = str_extract(basename(x), "^[^_]+"))) %>%
    select(participant_id, everything())
}

guess_data <- read_type("guess")
global_data <- read_type("global")
game_data <- read_type("game") %>%
  mutate(outcome = case_when(
    solved & !skipped ~ "solved",
    !solved & !skipped ~ "wrong",
    skipped ~ "skipped",
    TRUE ~ NA,
  ))
block_data <- read_type("block")

# one row per guess joined together with the metadata of games and blocks
big_table <- block_data %>%
  inner_join(game_data, by = join_by(participant_id, blockIndex), suffix = c("_block", "_game")) %>%
  inner_join(guess_data, by = join_by(participant_id, blockIndex, index_game == gameIndex), suffix = c("_game", "_guess"))

participant_data <- global_data %>%
  # usually we would flatten the global data per participant first, but we only have a single row per participant in our dataset
  inner_join(
    block_data %>%
      select(participant_id, blockIndex, feedbacktype) %>%
      arrange(participant_id, blockIndex) %>%
      group_by(participant_id) %>%
      summarize(order = paste(feedbacktype, collapse = "-")),
    by = join_by(participant_id)
  ) %>%
  select(-c(index, type, start, end, duration, name)) %>%
  select(participant_id, order, everything())


times_per_guess <- big_table %>%
  group_by(participant_id, blockIndex, feedbacktype) %>%
  summarize(mean_time_per_guess = mean(duration), sd_time_per_guess = sd(duration))

times_per_trial_and_block <- big_table %>%
  group_by(participant_id, blockIndex, feedbacktype, index_game) %>%
  # the duration_trial includes the surveys, this only looks at the time the guesses took
  summarize(active_duration_trial = sum(duration)) %>%
  summarize(mean_time_per_trial = mean(active_duration_trial), sd_time_per_trial = sd(active_duration_trial), sum_time_block = sum(active_duration_trial))


trials_per_block <- big_table %>%
  distinct(participant_id, blockIndex, feedbacktype, index_game, outcome) %>%
  group_by(participant_id, blockIndex, feedbacktype, outcome) %>%
  summarize(n_trials_outcome = n()) %>%
  mutate(n_trials_block = sum(n_trials_outcome)) %>%
  pivot_wider(names_from = outcome, values_from = n_trials_outcome, names_prefix="n_trials_") %>%
  mutate(across(c(n_trials_block, n_trials_skipped, n_trials_wrong, n_trials_solved), ~ replace_na(., 0))) %>%
  mutate(percetage_correct_trials = n_trials_solved / n_trials_block)


guesses_per_block <- big_table %>%
  group_by(participant_id, blockIndex, feedbacktype, outcome) %>%
  summarize(n_guesses_outcome = n()) %>% 
  mutate(n_guesses_block = sum(n_guesses_outcome)) %>%
  pivot_wider(names_from = outcome, values_from = n_guesses_outcome, names_prefix="n_guesses_in_trials_") %>%
  mutate(across(c(n_guesses_block, n_guesses_in_trials_skipped, n_guesses_in_trials_wrong, n_guesses_in_trials_solved), ~ replace_na(., 0)))

effort_per_block <- big_table %>%
   group_by(participant_id, blockIndex, feedbacktype) %>% 
   summarize(mean_effort = mean(intensityofeffort), sd_effort = sd(intensityofeffort))

experiment_data <- times_per_trial_and_block %>% 
  inner_join(times_per_guess, by = join_by(participant_id, blockIndex, feedbacktype)) %>% 
  inner_join(trials_per_block, by = join_by(participant_id, blockIndex, feedbacktype)) %>% 
  inner_join(guesses_per_block, by = join_by(participant_id, blockIndex, feedbacktype)) %>% 
  inner_join(effort_per_block, by = join_by(participant_id, blockIndex, feedbacktype))


#write_csv(experiment_data, './blockdata.csv')
#write_csv(participant_data, './participantdata.csv')
