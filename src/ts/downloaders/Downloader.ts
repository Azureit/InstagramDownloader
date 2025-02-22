/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (Downloader.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { LogClassErrors, stopObservation } from '../decorators';
import { DomObserver } from '../helper-classes/DomObserver';
import { SubscriptionInterface } from '../helper-classes/EventHandler';

/**
 * The base class of every downloader.
 */
@LogClassErrors
export abstract class Downloader {
    public static observer: DomObserver = new DomObserver();
    private subscription: SubscriptionInterface = {unsubscribe: () => null};

    /**
     * Create a new downloader
     */
    @stopObservation
    public init(): void {
        this.subscription = Downloader.observer.subscribe(this.reinitialize.bind(this));
        this.createDownloadButton();
    }

    /**
     * This method has to create a new download button
     */
    protected abstract createDownloadButton(): void;

    /**
     * This method has to remove and initialize the downloader
     */
    protected abstract reinitialize(): void;

    /**
     * Remove the downloader
     */
    @stopObservation
    protected remove(className: string): void {
        this.subscription.unsubscribe();
        // Remove all added elements if they have not already been removed
        const elements: HTMLElement[] = Array.from(document.getElementsByClassName(className)) as HTMLElement[];
        elements.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch {
                // Do nothing
            }
        });
    }

    /**
     * Get the account name of a post
     * @param element The post element
     * @param accountClass The class the account has
     */
    protected getAccountName(element: HTMLElement, accountClass: string): string {
        let accountName: string;
        try {
            accountName = (element.querySelector(accountClass) as HTMLElement).innerText;
        } catch {
            accountName = 'no_account_found';
        }

        return accountName;
    }

}
